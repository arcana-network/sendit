import { defineStore } from "pinia";
import { ShallowRef, shallowRef } from "vue";
import { Buffer } from "buffer";
import { EventEmitter } from "events";

import { BrowserProvider, getBytes, randomBytes, hashMessage } from "ethers";
import type { Eip1193Provider, JsonRpcSigner } from "ethers";
import { pack as msgpack, unpack as msgunpack } from "msgpackr";
import { Mutex } from "async-mutex";

enum ConnectionState {
  NOT_CONNECTED,
  CONNECTED_UNAUTHORIZED,
  AUTHORIZED,
}

enum ResponseType {
  Response,
  Notification
}

type Account = {
  verifier: string;
  verifier_id: string;
  referrer?: Buffer;
};

export class SocketError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

class Connection {
  static ON_CONNECT = Symbol();
  static ON_DISCONNECT = Symbol();
  static ON_NOTIFICATION = Symbol();
  static ON_ERROR = Symbol();
  static MESSAGE_HASH_KEY = "SENDIT_LAST_HASH_KEY";
  static DISCONNECTION_INTENTIONAL = 4242;

  private state: ConnectionState;
  // private readonly provider: BrowserProvider
  private readonly signer: JsonRpcSigner;
  private readonly account: Account;
  private socketSerial = 0;
  // @ts-ignore
  private socket: WebSocket;
  private callbackMap = new Map<
    number,
    [(_: unknown) => void, (_: unknown) => void]
  >();
  private mutex = new Mutex();
  public emitter = new EventEmitter();

  constructor(signer: JsonRpcSigner, account: Account) {
    this.state = ConnectionState.NOT_CONNECTED;
    // this.provider = provider
    this.signer = signer;
    this.account = account;

    this.sendMessage = this.sendMessage.bind(this);
  }

  static async create(signer: JsonRpcSigner, account: Account) {
    const c = new Connection(signer, account);
    await c.openSocket();
    return c;
  }

  private async openSocket() {
    this.socketSerial++;
    const closeCb = this.getCloseCb(this.socketSerial);

    this.state = ConnectionState.NOT_CONNECTED;
    this.socket = new WebSocket(import.meta.env.VITE_API_URL);
    this.socket.addEventListener("open", this.onOpen.bind(this));
    this.socket.addEventListener("message", this.onMessage.bind(this));
    this.socket.addEventListener("close", closeCb);
    this.socket.addEventListener("error", closeCb);
  }

  private genRandUID(): number {
    return Buffer.from(randomBytes(4)).readUInt32LE();
  }

  public async sendMessage(id: number, data?: any) {
    const uid = this.genRandUID();
    await this.mutex.acquire();
    let p;
    try {
      p = new Promise((resolve, reject) => {
        this.callbackMap.set(uid, [resolve, reject]);
        this.socket.send(msgpack([uid, id, data]));
      });
    } finally {
      this.mutex.release();
    }
    return p;
  }

  public async onOpen() {
    this.socket.send(
      msgpack({
        addr: getBytes(await this.signer.getAddress()),
        ...this.account,
      })
    );
  }

  public getCloseCb(socketSerial: Number) {
    return async (ev: CloseEvent | Event) => {
      if (this.socketSerial != socketSerial) {
        console.log("Skipping reconnect", this.socketSerial, socketSerial);
        return;
      }
      this.emitter.emit(Connection.ON_DISCONNECT);
      if (!("code" in ev && ev.code === Connection.DISCONNECTION_INTENTIONAL)) {
        if (
          this.socket.readyState == WebSocket.CONNECTING ||
          this.socket.readyState === WebSocket.OPEN
        ) {
          this.socket.close(Connection.DISCONNECTION_INTENTIONAL);
        }
        // basically preventing any other callback from reinitializing the socket
        this.socketSerial++;
        if (!this.mutex.isLocked()) {
          await this.mutex.acquire();
        }
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.openSocket();
      }
    };
  }

  public closeSocket() {
    this.socket.close(Connection.DISCONNECTION_INTENTIONAL);
  }

  public async onMessage(ev: MessageEvent) {
    const _data = msgunpack(Buffer.from(await ev.data.arrayBuffer()));
    if (_data.length !== 3) {
      console.log("Weird/unimplemented message found:", _data);
      return;
    }
    const [id, rtype, data] = _data;

    switch (this.state) {
      case ConnectionState.NOT_CONNECTED: {
        const hash = hashMessage(data.message);

        const existingPairStr = localStorage.getItem(
          Connection.MESSAGE_HASH_KEY
        );
        let sig: string;
        const existingPair = existingPairStr ? JSON.parse(existingPairStr) : {};
        if (existingPair.hash === hash) {
          sig = existingPair.sig;
        } else {
          localStorage.removeItem(Connection.MESSAGE_HASH_KEY);
          try {
            sig = await this.signer.signMessage(data.message);
          } catch (e) {
            return this.emitter.emit(Connection.ON_ERROR, e);
          }
          localStorage.setItem(
            Connection.MESSAGE_HASH_KEY,
            JSON.stringify({ hash, sig })
          );
        }

        this.socket.send(
          msgpack({
            sig: getBytes(sig),
          })
        );
        this.state = ConnectionState.CONNECTED_UNAUTHORIZED;
        break;
      }
      case ConnectionState.CONNECTED_UNAUTHORIZED:
        if (data.login) {
          this.state = ConnectionState.AUTHORIZED;
          this.emitter.emit(Connection.ON_CONNECT);
          this.mutex.release();
        } else {
          this.emitter.emit(Connection.ON_ERROR, data);
        }
        break;
      case ConnectionState.AUTHORIZED: {
        switch (rtype) {
          case ResponseType.Response: {
            const cbs = this.callbackMap.get(id);
            if (cbs == null) {
              console.log("Message found with no outstanding request:", cbs);
              return;
            }
            this.callbackMap.delete(id);
            const [resolve, reject] = cbs;
            if (data.error) {
              reject(new SocketError(data.msg, data.code));
            } else {
              resolve(data);
            }
            break
          }
          case ResponseType.Notification: {
            this.emitter.emit(Connection.ON_NOTIFICATION, data)
          }
        }
        break;
      }
    }
  }
}

type ConnectionStoreState = {
  connected: boolean;
  connection: ShallowRef<Connection>;
};

export const useConnection = defineStore("connection", {
  state: () =>
    <ConnectionStoreState>{
      connected: false,
      connection: shallowRef<Connection>(),
    },
  getters: {
    sendMessage(state) {
      return state.connection.sendMessage.bind(state.connection);
    },
    closeSocket(state) {
      return state.connection.closeSocket.bind(state.connection);
    },
    onEvent(state) {
      return state.connection.emitter.on.bind(state.connection.emitter);
    },
  },
  actions: {
    onConnect() {
      this.connected = true;
    },
    onDisconnect() {
      this.connected = false;
    },

    async initialize(_prov: Eip1193Provider, account: Account) {
      if (this.connection) {
        this.connection.closeSocket();
      }

      const prov = new BrowserProvider(_prov);
      const s = await prov.getSigner();
      this.connection = await Connection.create(s, account);
      this.connection.emitter.on(
        Connection.ON_CONNECT,
        this.onConnect.bind(this)
      );
      this.connection.emitter.on(
        Connection.ON_DISCONNECT,
        this.onDisconnect.bind(this)
      );
    },
  },
});

export { Connection, Account as SocketConnectionAccount };
