import { BrowserProvider, getBytes } from "ethers";
import type { JsonRpcSigner } from "ethers";
import { AuthProvider } from "@arcana/auth";
import { pack as msgpack, unpack as msgunpack } from "msgpackr";
import { Mutex } from "async-mutex";
import type { MutexInterface } from "async-mutex";
import { useToast } from "vue-toastification";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const SOCKET_CLOSED_ON_LOGOUT = 3000;
const ACTION_REJECTED = "ACTION_REJECTED";

enum ConnectionState {
  NOT_CONNECTED,
  CONNECTED_UNAUTHORIZED,
  AUTHORIZED,
}

let socket: WebSocket;
let ethersProvider: BrowserProvider;
let ethersSigner: JsonRpcSigner;
let callbacks = null;
let state = ConnectionState.NOT_CONNECTED;
let initialRelease: MutexInterface.Releaser | null = null;
let lock = new Mutex();

type Account = {
  verifier: string;
  verifier_id: string;
};

function useSocketConnection() {
  let currentAccount: Account = {
    verifier: "",
    verifier_id: "",
  };
  const toast = useToast();

  async function init(
    authProvider: AuthProvider,
    account: Account,
    onSocketLogin?: Function
  ) {
    state = ConnectionState.NOT_CONNECTED;
    initialRelease = await lock.acquire();
    try {
      // @ts-ignore
      ethersProvider = new BrowserProvider(authProvider);
      ethersSigner = await ethersProvider.getSigner();
      currentAccount = account;
      socket = new WebSocket(VITE_API_URL);
      socket.addEventListener("open", onSocketOpen);
      socket.addEventListener("message", (ev: MessageEvent) =>
        onMessage(ev, onSocketLogin)
      );
      socket.addEventListener("close", (e) => {
        if (e.code !== SOCKET_CLOSED_ON_LOGOUT) {
          init(authProvider, account, onSocketLogin);
        }
      });
    } catch (e) {
      console.log({ e });
    }
  }

  async function onSocketOpen() {
    socket.send(
      msgpack({
        addr: getBytes(await ethersSigner.getAddress()),
        verifier: currentAccount.verifier,
        verifier_id: currentAccount.verifier_id,
      })
    );

    setInterval(function () {
      sendMessage(255, { ping: true });
    }, 59000);
  }

  async function sendMessage(id: number, data?: any) {
    const release = await lock.acquire();
    return new Promise((resolve, reject) => {
      // @ts-ignore
      callbacks = [resolve, release, reject];
      socket.send(Buffer.concat([Uint8Array.from([id]), msgpack(data)]));
    });
  }

  async function onMessage(
    ev: MessageEvent,
    onSocketLogin: Function | undefined
  ) {
    const data = msgunpack(Buffer.from(await ev.data.arrayBuffer()));
    if (data.error) {
      if (callbacks) {
        // @ts-ignore
        const [, release, reject] = callbacks;
        callbacks = null;
        // @ts-ignore
        release();
        // @ts-ignore
        reject(data.msg);
      }
      return;
    }

    switch (state) {
      case ConnectionState.NOT_CONNECTED: {
        try {
          const sig = await ethersSigner.signMessage(data.message);
          socket.send(
            msgpack({
              sig: getBytes(sig),
            })
          );
          state = ConnectionState.CONNECTED_UNAUTHORIZED;
        } catch (e) {
          // @ts-ignore
          if (e.code === ACTION_REJECTED) {
            toast.error(
              "Signature request rejected. Please refresh the page again to login"
            );
          } else {
            toast.error(e as string);
          }
        }
        break;
      }
      case ConnectionState.CONNECTED_UNAUTHORIZED:
        if (data.login) {
          state = ConnectionState.AUTHORIZED;
          if (onSocketLogin) onSocketLogin();
          if (initialRelease) initialRelease();
        }
        break;
      case ConnectionState.AUTHORIZED:
        if (callbacks) {
          // @ts-ignore
          const [resolve, releaseLock] = callbacks;
          callbacks = null;
          // @ts-ignore
          releaseLock();
          // @ts-ignore
          resolve(data);
        }
        break;
    }
  }

  function disconnect() {
    socket.close(SOCKET_CLOSED_ON_LOGOUT);
  }

  return {
    init,
    onSocketOpen,
    sendMessage,
    onMessage,
    disconnect,
  };
}

export default useSocketConnection;
