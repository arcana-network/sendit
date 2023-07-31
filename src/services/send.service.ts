import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, Contract } from "ethers";
import { Decimal } from "decimal.js";

const SELF_TX_ERROR = "self-transactions are not permitted";

async function fillTxGas(prov, tx) {
  const net = await prov._detectNetwork();
  if (net.chainId === 137n) {
    const resp = await (await fetch('https://gasstation.polygon.technology/v2')).json()
    tx.maxPriorityFeePerGas = Decimal(resp.standard.maxPriorityFee).mul(Decimal.pow(10, 9)).toHexadecimal()
    tx.maxFeePerGas = Decimal(resp.standard.maxFee).mul(Decimal.pow(10, 9)).toHexadecimal()
  }
}

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

  const rawTx = {
    type: 2,
    gasLimit: 21000,
    to: receiverWalletAddress,
    value: decimalAmount.mul(10 ** 18).toHexadecimal(),
  }
  await fillTxGas(web3Provider, rawTx)

  const tx = await wallet.sendTransaction(rawTx);
  return await tx.wait(4);
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
  const ptx = await tokenContract.transfer.populateTransaction(
    receiverWalletAddress,
    decimalAmount.mul(Decimal.pow(10, tokenDecimals)).toString()
  );
  await fillTxGas(web3Provider, ptx)
  const tx = await wallet.sendTransaction(ptx)
  return { ...(await tx.wait(4)), to: receiverWalletAddress };
}

export { nativeTokenTransfer, erc20TokenTransfer };
