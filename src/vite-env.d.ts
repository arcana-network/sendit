/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (args: { method: string }) => Promise<string[]>;
    };
    grecaptcha: {
      render: (
        id: string,
        args: {
          siteKey: string;
          size: "invisible";
          callback: (token: string) => void;
        }
      ) => void;
      execute: () => void;
    };
  }
}

export {};
