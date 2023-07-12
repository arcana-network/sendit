function useMetamask() {
  function isMetamaskInstalled(): boolean {
    return window.ethereum && window.ethereum.isMetaMask;
  }

  async function connectMetamask() {
    try {
      if (isMetamaskInstalled()) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        return { accounts, provider: window.ethereum };
      } else {
        throw new Error("Metamask is not installed");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return {
    isMetamaskInstalled,
    connectMetamask,
  };
}

export default useMetamask;
