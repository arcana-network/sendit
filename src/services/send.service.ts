import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, Contract } from "ethers";
import { Decimal } from "decimal.js";

const SELF_TX_ERROR = "self-transactions are not permitted";

type FeeData = {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

async function nativeTokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: number,
  feeData: FeeData | null
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = computeAddress(`0x${publickey}`);
  if (wallet.address === receiverWalletAddress) throw new Error(SELF_TX_ERROR);
  const decimalAmount = new Decimal(amount);
  const rawTx: any = {
    type: 2,
    to: receiverWalletAddress,
    value: decimalAmount.mul(Decimal.pow(10, 18)).toHexadecimal(),
  };
  if (feeData) {
    rawTx.gasLimit = 21000n;
    rawTx.maxFeePerGas = feeData.maxFeePerGas;
    rawTx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
  }
  const tx = await wallet.sendTransaction(rawTx);
  const confirmed = await tx.wait(4);
  if (confirmed == null) {
    throw new Error("Invalid transaction");
  }
  return confirmed;
}

const erc20Abi = [
  "function transfer(address to, uint256 value) public returns (bool)",
  "function decimals() public view returns (uint8)",
];

async function erc20TokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: number,
  tokenAddress: string,
  feeData: FeeData | null
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
  const ptx = await tokenContract.transfer.populateTransaction(
    receiverWalletAddress,
    decimalAmount.mul(Decimal.pow(10, tokenDecimals)).toString()
  );
  ptx.gasLimit = await web3Provider.estimateGas(ptx);
  if (feeData) {
    ptx.maxFeePerGas = BigInt(feeData.maxFeePerGas);
    ptx.maxPriorityFeePerGas = BigInt(feeData.maxPriorityFeePerGas);
  }
  const tx = await wallet.sendTransaction(ptx);
  const confirmed = await tx.wait(4);

  if (confirmed == null) {
    throw new Error("Invalid transaction");
  }

  return { hash: confirmed.hash, to: receiverWalletAddress };
}

export { nativeTokenTransfer, erc20TokenTransfer };
export type { FeeData };
