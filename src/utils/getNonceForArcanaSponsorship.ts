import { ethers, JsonRpcProvider } from "ethers";
import useArcanaAuth from "@/use/arcanaAuth";

const arcanaAuth = useArcanaAuth();

const provider = arcanaAuth.getProvider();

async function getNonceForArcanaSponsorship(
  address: string
): Promise<ethers.BigNumberish> {
  const c = new ethers.Contract(
    "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
    [
      {
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            internalType: "uint192",
            name: "key",
            type: "uint192",
          },
        ],
        name: "getNonce",
        outputs: [
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider as unknown as JsonRpcProvider
  );

  return await c.getNonce(address, 0);
}

export default getNonceForArcanaSponsorship;
