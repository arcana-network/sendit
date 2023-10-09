function useOKXWallet() {
  function isOKXWalletInstalled(): boolean {
    return window.okxwallet && window.okxwallet.isOkxWallet;
  }

  async function connectOKXWallet() {
    try {
      if (isOKXWalletInstalled()) {
        const accounts = await window.okxwallet.request({
          method: "eth_requestAccounts",
        });
        return { accounts, provider: window.okxwallet };
      } else {
        throw "wallet_not_installed";
      }
    } catch (error: any) {
      throw error;
    }
  }

  return {
    isOKXWalletInstalled,
    connectOKXWallet,
  };
}

export default useOKXWallet;
