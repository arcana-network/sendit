import { EthereumProvider } from "@arcana/auth";
import {
  BrowserProvider,
  computeAddress,
  Contract,
  ethers,
  Interface,
} from "ethers";
import { Decimal } from "decimal.js";
import senditRequestAbi from "@/abis/sendit-request.abi.json";
import erc20ABI from "@/abis/erc20.abi.json";
import { useConnection } from "@/stores/connection";
import { SOCKET_IDS } from "@/constants/socket-ids";
import useUserStore from "@/stores/user";
import store from "@/stores";
import { scwInstance } from "@/utils/scw";
import axios from "axios";

const userStore = useUserStore(store);

const SELF_TX_ERROR = "self-transactions are not permitted";

type FeeData = {
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

function isWalletAddress(address: string) {
  return address.length === 42 && address.startsWith("0x");
}

async function checkIfTransactionConfirmed(chainId, userOpHash) {
  try {
    const URL = `https://bundler.biconomy.io/api/v2/${chainId}/cJPK7B3ru.kj908Yuj-89hY-45ic-lRe5-6877flTvjy561`;
    const payload = {
      method: "biconomy_getUserOperationStatus",
      params: [userOpHash],
      id: 1693369916,
      jsonrpc: "2.0",
    };
    const res = await axios.post(URL, payload);
    return res.data.result;
  } catch (e) {
    console.log(e);
  }
}

async function nativeTokenTransfer(
  publickey: string,
  provider: EthereumProvider,
  amount: number,
  feeData: FeeData | null,
  nonce: number,
  isGasless?: boolean,
  chain_id?: string | number,
  isDeposit?: boolean
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = isWalletAddress(publickey)
    ? publickey
    : computeAddress(`0x${publickey}`);
  let gaslessAddress = "";
  if (isGasless) {
    try {
      const conn = useConnection();
      const res = await conn.sendMessage(SOCKET_IDS.GET_GASLESS_INFO, {
        chain_id: chain_id,
        address: Buffer.from(ethers.getBytes(receiverWalletAddress)),
      });
      if (res.opted_in) {
        gaslessAddress = ethers.hexlify(res.scw_address);
        if (
          gaslessAddress?.toLowerCase() ===
          userStore.gaslessAddress?.toLowerCase()
        )
          throw new Error(SELF_TX_ERROR);
      }
    } catch (e) {
      console.error(
        "User not found on SendIt, sending tokens to his Regular Wallet"
      );
    }
  }
  if (
    !isDeposit &&
    wallet.address?.toLowerCase() === receiverWalletAddress?.toLowerCase()
  )
    throw new Error(SELF_TX_ERROR);
  const decimalAmount = new Decimal(amount);
  const rawTx: any = {
    type: 2,
    to: gaslessAddress || receiverWalletAddress,
    value: decimalAmount.mul(Decimal.pow(10, 18)).ceil().toHexadecimal(),
  };
  if (feeData) {
    // rawTx.gasLimit = 21000n;
    rawTx.maxFeePerGas = feeData.maxFeePerGas;
    rawTx.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
  }
  console.log(
    { is: isGasless && nonce < 15 },
    { isGasless },
    { nonce },
    "nonce-nonce-1"
  );
  if (isGasless && nonce < 15) {
    console.log({ isGasless }, { nonce }, "nonce-nonce-2");
    const txParams = {
      from: scwInstance.scwAddress,
      to: gaslessAddress || receiverWalletAddress,
      value: decimalAmount.mul(Decimal.pow(10, 18)).ceil().toHexadecimal(),
    };
    console.log({ txParams }, "txParams");
    const tx = await scwInstance.doTx(txParams, {
      mode: "ARCANA",
      calculateGasLimits: true,
    });
    const transactionData = await tx.wait();
    await new Promise(function (resolve) {
      setInterval(async () => {
        const status = await checkIfTransactionConfirmed(
          chain_id,
          transactionData.userOpHash
        );
        console.log(status, "status");
        if (status.state === "CONFIRMED") {
          resolve(true);
        }
      }, 1000);
    });
    return {
      ...transactionData,
      hash: transactionData.receipt.transactionHash,
      to: gaslessAddress || receiverWalletAddress,
    };
  } else {
    const tx = await wallet.sendTransaction(rawTx);
    const confirmed = await tx.wait(4);
    if (confirmed == null) {
      throw new Error("Invalid transaction");
    }
    return {
      ...confirmed,
      to: gaslessAddress || receiverWalletAddress,
    };
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
  tokenAddress: string,
  feeData: FeeData | null,
  nonce: number,
  isGasless?: boolean,
  chain_id?: string | number,
  isDeposit?: boolean
) {
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  const receiverWalletAddress = isWalletAddress(publickey)
    ? publickey
    : computeAddress(`0x${publickey}`);
  if (
    !isDeposit &&
    wallet.address?.toLowerCase() === receiverWalletAddress?.toLowerCase()
  )
    throw new Error(SELF_TX_ERROR);
  let gaslessAddress = "";
  if (isGasless) {
    const conn = useConnection();
    const res = await conn.sendMessage(SOCKET_IDS.GET_GASLESS_INFO, {
      chain_id: chain_id,
      address: Buffer.from(ethers.getBytes(receiverWalletAddress)),
    });
    if (res.opted_in) {
      gaslessAddress = ethers.hexlify(res.scw_address);
      if (
        gaslessAddress?.toLowerCase() ===
        userStore.gaslessAddress?.toLowerCase()
      )
        throw new Error(SELF_TX_ERROR);
    }
  }
  const tokenContract = new Contract(tokenAddress, erc20Abi, wallet);
  let tokenDecimals: number;
  const decimalAmount = new Decimal(amount);
  try {
    tokenDecimals = Number(await tokenContract.decimals());
  } catch (e) {
    tokenDecimals = 0;
  }
  const ptx = await tokenContract.transfer.populateTransaction(
    gaslessAddress || receiverWalletAddress,
    decimalAmount.mul(Decimal.pow(10, tokenDecimals)).toString()
  );
  ptx.from = await wallet.getAddress();
  ptx.gasLimit = await web3Provider.estimateGas(ptx);
  if (feeData) {
    ptx.maxFeePerGas = BigInt(feeData.maxFeePerGas);
    ptx.maxPriorityFeePerGas = BigInt(feeData.maxPriorityFeePerGas);
  }
  if (isGasless && nonce < 15) {
    const abi = [
      "function transfer(address recipient, uint256 amount) returns (bool)",
    ];
    const Erc20Interface = new Interface(abi);
    const encodedData = Erc20Interface.encodeFunctionData("transfer", [
      gaslessAddress || receiverWalletAddress,
      amount,
    ]);

    const txParams = {
      from: scwInstance.scwAddress,
      to: tokenContract.getAddress(),
      data: encodedData,
    };
    const tx = await scwInstance.doTx(txParams, {
      mode: "ARCANA",
      calculateGasLimits: true,
    });
    const confirmed = await tx.wait();
    return {
      ...confirmed,
      hash: confirmed.userOpHash,
      to: gaslessAddress || receiverWalletAddress,
    };
  }
  const tx = await wallet.sendTransaction(ptx);
  const confirmed = await tx.wait(4);

  if (confirmed == null) {
    throw new Error("Invalid transaction");
  }

  return { hash: confirmed.hash, to: gaslessAddress || receiverWalletAddress };
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
