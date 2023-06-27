import { BrowserProvider, getBytes } from "ethers";
import type { JsonRpcSigner } from "ethers";
import { AuthProvider } from "@arcana/auth";
import { pack as msgpack, unpack as msgunpack } from "msgpackr";

const VITE_API_URL = import.meta.env.VITE_API_URL;

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

function useSocketConnection() {
  async function init(authProvider: AuthProvider, onSocketLogin?: Function) {
    try {
      ethersProvider = new BrowserProvider(authProvider);
      ethersSigner = await ethersProvider.getSigner();
      socket = new WebSocket(VITE_API_URL);
      socket.addEventListener("open", onSocketOpen);
      socket.addEventListener("message", (ev: MessageEvent) =>
        onMessage(ev, onSocketLogin)
      );
    } catch (e) {
      console.log({ e });
    }
  }

  async function onSocketOpen() {
    socket.send(
      msgpack({
        addr: getBytes(await ethersSigner.getAddress()),
      })
    );
  }

  function sendMessage(id: number, data: any) {
    if (callbacks) {
      throw new Error("Another request is already in progress");
    }
    return new Promise((resolve, reject) => {
      callbacks = [resolve, reject];
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
        const [, reject] = callbacks;
        callbacks = null;
        reject(data.msg);
      }
      return;
    }

    switch (state) {
      case ConnectionState.NOT_CONNECTED: {
        const sig = await ethersSigner.signMessage(data.message);
        socket.send(
          msgpack({
            sig: getBytes(sig),
          })
        );
        state = ConnectionState.CONNECTED_UNAUTHORIZED;
        break;
      }
      case ConnectionState.CONNECTED_UNAUTHORIZED:
        if (data.ok) {
          state = ConnectionState.AUTHORIZED;
          onSocketLogin();
        }
        break;
      case ConnectionState.AUTHORIZED:
        if (callbacks) {
          const [resolve] = callbacks;
          callbacks = null;
          resolve(data);
        }
        break;
    }
  }

  return {
    init,
    onSocketOpen,
    sendMessage,
    onMessage,
  };
}

export default useSocketConnection;
