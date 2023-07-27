import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, parseUnits, Contract } from "ethers";
import { Decimal } from "decimal.js";

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
  const decimalAmount = new Decimal(amount);
  const tx = await wallet.sendTransaction({
    to: receiverWalletAddress,
    value: decimalAmount.mul(10 ** 18).toString(),
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
  let tokenDecimals: number;
  const decimalAmount = new Decimal(amount);
  try {
    tokenDecimals = Number(await tokenContract.decimals());
  } catch (e) {
    tokenDecimals = 0;
  }
  const tx = await tokenContract.transfer(
    receiverWalletAddress,
    decimalAmount.mul(10 ** tokenDecimals).toString()
  );
  return { ...(await tx.wait()), to: receiverWalletAddress };
}

export { nativeTokenTransfer, erc20TokenTransfer };
