import { ethers, computeAddress } from "ethers";

async function nativeTokenTransfer(
  publickey: string,
  rpcUrl: string,
  amount: string
) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(
    "9e5135396a754a2d0e64b00ffdba8b374c3918186d3f6016facc9d4d1ebbaab1",
    provider
  );
  console.log({ wallet });
  const walletAddress = computeAddress(`0x${publickey}`);
  const tx = await wallet.sendTransaction({
    to: walletAddress,
    value: amount,
  });
  return await tx.wait();
}

export { nativeTokenTransfer };
