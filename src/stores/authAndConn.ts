import { defineStore } from "pinia";
import { shallowRef } from "vue";
import { Buffer } from 'buffer'

import { AuthProvider } from '@arcana/auth';
import { BrowserProvider, getBytes } from 'ethers'
import type { JsonRpcSigner } from 'ethers'
import { pack as msgpack, unpack as msgunpack } from 'msgpackr'

enum ConnectionState {
    NOT_CONNECTED,
    CONNECTED_UNAUTHORIZED,
    AUTHORIZED
}
class Connection {
    private state: ConnectionState
    // private readonly provider: BrowserProvider
    private readonly signer: JsonRpcSigner
    private socket: WebSocket
    private callbacks: [(_: unknown) => void, (_: unknown) => void] | null
    public cbOpen: () => void

    constructor (_: BrowserProvider, signer: JsonRpcSigner) {
        this.state = ConnectionState.NOT_CONNECTED
        // this.provider = provider
        this.signer = signer
        this.socket = new WebSocket(import.meta.env.VITE_API_URL)
        this.socket.addEventListener('open', this.onOpen.bind(this))
        this.socket.addEventListener('message', this.onMessage.bind(this))
        this.callbacks = null
        this.cbOpen = () => null
    }

    sendMessage (id: number, data: any) {
        // TODO guard with a mutex to allow parallel calls, or add message IDs
        if (this.callbacks != null) {
            throw new Error('Another request is already in progress')
        }
        return new Promise((resolve, reject) => {
            this.callbacks = [resolve, reject]
            this.socket.send(Buffer.concat([Uint8Array.from([id]), msgpack(data)]))
        })
    }

    async onOpen () {
        this.socket.send(msgpack({
            addr: getBytes(await this.signer.getAddress())
        }))
    }

    async onMessage (ev: MessageEvent) {
        const data = msgunpack(Buffer.from(await ev.data.arrayBuffer()))

        if (data.error === true) {
            if (this.callbacks != null) {
                const [, reject] = this.callbacks
                this.callbacks = null
                reject(data.msg)
            }
            return
        }

        switch (this.state) {
            case ConnectionState.NOT_CONNECTED: {
                const sig = await this.signer.signMessage(data.message)
                this.socket.send(msgpack({
                    sig: getBytes(sig)
                }))
                this.state = ConnectionState.CONNECTED_UNAUTHORIZED
                break
            }
            case ConnectionState.CONNECTED_UNAUTHORIZED:
                if (data.ok) {
                    this.state = ConnectionState.AUTHORIZED
                    this.cbOpen()
                }
                break
            case ConnectionState.AUTHORIZED:
                if (this.callbacks != null) {
                    const [resolve] = this.callbacks
                    this.callbacks = null
                    resolve(data)
                }
                break
        }
    }
}

export const useAuthAndConnStore = defineStore('authAndConn', {
    state: () => ({
        init1: false,
        init2: false,
        init3: false,
        provider: shallowRef(),
        connection: shallowRef<Connection>(),
        ethersProvider: shallowRef<BrowserProvider>(),
        ethersSigner: shallowRef<JsonRpcSigner>()
    }),
    actions: {
        async initialize () {
            const prov = new AuthProvider(import.meta.env.VITE_ARCANA_APP_ID)
            await prov.init()
            this.provider = prov
            this.init1 = true

            this.provider.provider.once('connect', () => {
                return this.onLoggedIn()
            })
        },

        async onLoggedIn () {
            const prov = new BrowserProvider(this.provider.provider)
            const s = await prov.getSigner()
            console.log('Signed In:', await s.getAddress())

            this.ethersProvider = prov
            this.ethersSigner = s
            this.connection = new Connection(prov, s)
            this.connection.cbOpen = () => {
                this.init3 = true
            }
        },

        connect () {
            return this.provider.connect()
        }
    }
})
