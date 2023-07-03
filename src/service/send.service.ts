import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, parseUnits, Contract } from "ethers";

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

const erc20Abi = [
  "function transfer(address to, uint256 value) public returns (bool)",
];

async function erc20TokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: string,
  tokenAddress: string
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = computeAddress(`0x${publickey}`);
  const tokenContract = new Contract(tokenAddress, erc20Abi, wallet);
  const tx = await tokenContract.transfer(
    receiverWalletAddress,
    parseUnits(amount, 18)
  );
  return await tx.wait();
}

export { nativeTokenTransfer, erc20TokenTransfer };
