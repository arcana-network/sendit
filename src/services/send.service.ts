import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, Contract, ethers } from "ethers";
import { Decimal } from "decimal.js";
import senditRequestAbi from "@/abis/sendit-request.abi.json";
import erc20ABI from "@/abis/erc20.abi.json";

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
  ptx.from = await wallet.getAddress();
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

type RequestedNativeTokenTransferData = {
  signature: string;
  nonce: string;
  value: string;
  recipientAddress: string;
  tokenAddress: string;
  expiry: number;
  isNative: boolean;
  provider: any;
  senditContract: string;
};

async function requestedTokenTransfer(
  data: RequestedNativeTokenTransferData,
  feeData: FeeData | null
) {
  const { v, r, s } = ethers.Signature.from(data.signature);
  const web3Provider = new BrowserProvider(data.provider);
  const wallet = await web3Provider.getSigner();
  const senditContract = new Contract(
    data.senditContract,
    senditRequestAbi,
    wallet
  );
  const ptx = await senditContract.send.populateTransaction(
    data.nonce,
    data.recipientAddress,
    data.value,
    data.tokenAddress,
    data.expiry,
    v,
    r,
    s,
    { value: data.isNative ? data.value : 0 }
  );
  ptx.from = await wallet.getAddress();
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

  return { hash: confirmed.hash };
}

async function getERC20Approval(
  tokenContract: string,
  senditContract: string,
  value: string,
  provider: any
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const erc20Contract = new Contract(tokenContract, erc20ABI, wallet);
  const ptx = await erc20Contract.approve.populateTransaction(
    senditContract,
    value
  );
  ptx.from = await wallet.getAddress();
  ptx.gasLimit = await web3Provider.estimateGas(ptx);
  const tx = await wallet.sendTransaction(ptx);
  await tx.wait(4);
}

export {
  nativeTokenTransfer,
  erc20TokenTransfer,
  requestedTokenTransfer,
  getERC20Approval,
};
export type { FeeData };
