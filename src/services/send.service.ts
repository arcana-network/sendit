import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, parseUnits, Contract } from "ethers";

const SELF_TX_ERROR = "self-transactions are not permitted";

async function nativeTokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: number
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = computeAddress(`0x${publickey}`);
  if (wallet.address === receiverWalletAddress) throw new Error(SELF_TX_ERROR);
  const tx = await wallet.sendTransaction({
    to: receiverWalletAddress,
    value: parseUnits(amount.toFixed(18), 18),
  });
  return await tx.wait();
}

const erc20Abi = [
  "function transfer(address to, uint256 value) public returns (bool)",
  "function decimals() public view returns (uint8)",
];

async function erc20TokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: number,
  tokenAddress: string
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = computeAddress(`0x${publickey}`);
  if (wallet.address === receiverWalletAddress) throw new Error(SELF_TX_ERROR);
  const tokenContract = new Contract(tokenAddress, erc20Abi, wallet);
  const tokenDecimals = Number(await tokenContract.decimals());
  const tx = await tokenContract.transfer(
    receiverWalletAddress,
    parseUnits(amount.toFixed(tokenDecimals), tokenDecimals)
  );
  return { ...(await tx.wait()), to: receiverWalletAddress };
}

export { nativeTokenTransfer, erc20TokenTransfer };
