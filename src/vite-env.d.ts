/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (args: { method: string }) => Promise<string[]>;
    };
  }
}

export {};
