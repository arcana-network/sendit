import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, parseUnits } from "ethers";

async function nativeTokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: string
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = computeAddress(`0x${publickey}`);
  const tx = await wallet.sendTransaction({
    to: receiverWalletAddress,
    value: parseUnits(amount, 18),
  });
  return await tx.wait();
}

export { nativeTokenTransfer };
