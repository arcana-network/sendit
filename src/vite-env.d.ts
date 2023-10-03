/// <reference types="vite/client" />

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: (args: { method: string }) => Promise<string[]>;
    };
    okxwallet: {
      isOkxWallet: boolean;
      request: (args: { method: string }) => Promise<string[]>;
    };
    grecaptcha: {
      render: (
        id: string,
        args: {
          sitekey: string;
          size?: "invisible";
          badge?: "bottomright" | "bottomleft" | "inline";
          callback: (token: string) => void;
        },
        inherit?: Record<string, unknown>
      ) => void;
      execute: () => void;
      reset: () => void;
    };
  }
}

export {};
