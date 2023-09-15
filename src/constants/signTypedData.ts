import { BrowserProvider } from "ethers";

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const Request = [
  { name: "nonce", type: "uint256" },
  { name: "recipient", type: "address" },
  { name: "value", type: "uint256" },
  { name: "token_address", type: "address" },
  { name: "expiry", type: "uint256" },
];

function getMetaTxTypeData(chainId: number, verifyingContract: string) {
  return {
    types: {
      EIP712Domain,
      Request,
    },
    domain: {
      name: "Sendit",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "Request",
  };
}

async function signTypedData(provider: any, data: any) {
  delete data.types.EIP712Domain;
  const web3Provider = new BrowserProvider(provider);
  const wallet = await web3Provider.getSigner();
  return await wallet.signTypedData(data.domain, data.types, data.message);
}

async function buildTypedData(chainId: number, sendit: any, request: any) {
  const typeData = getMetaTxTypeData(chainId, sendit.target);
  return { ...typeData, message: request };
}

export { getMetaTxTypeData, signTypedData, buildTypedData };
