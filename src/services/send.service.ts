import { EthereumProvider } from "@arcana/auth";
import { BrowserProvider, computeAddress, Contract } from "ethers";
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
  const txHash = await wallet.sendUncheckedTransaction({
    to: receiverWalletAddress,
    value: decimalAmount.mul(10 ** 18).toString(),
  });
  try {
    const tx = await web3Provider.waitForTransaction(txHash, 4);
    return tx;
  } catch (e: any) {
    console.log(e, e.code === "TIMEOUT");
    return { hash: txHash };
  }
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
  return { ...(await tx.wait(4)), to: receiverWalletAddress };
}

export { nativeTokenTransfer, erc20TokenTransfer };
