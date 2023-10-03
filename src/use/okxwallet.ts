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
        throw new Error(
          "OKXWallet is not installed. Please install OKXWallet to continue."
        );
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  return {
    isOKXWalletInstalled,
    connectOKXWallet,
  };
}

export default useOKXWallet;
