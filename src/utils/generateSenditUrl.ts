import { hexlify, randomBytes } from "ethers";

export default function generateSenditUrl(): `https://sendit.arcana.network/?share=${string}` {
  return `https://sendit.arcana.network/?share=${hexlify(randomBytes(4))}`;
}
