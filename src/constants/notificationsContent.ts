import { truncateAddress } from "@/utils/truncateAddress";
import { hexlify, formatUnits } from "ethers";
import { nativeUnitMapping } from "./unitMapping";
import { beautifyAmount } from "@/utils/beautifyAmount";

function getDecimals(txInfo: any) {
  if (txInfo && "decimals" in txInfo) {
    return (txInfo.decimals as number) || 0;
  }
  return 18;
}

function getCurrency(chainId: string | number, info: any) {
  if (info && "symbol" in info) {
    return info.symbol || "units";
  }
  return nativeUnitMapping[Number(chainId)];
}

const notificationsContent = {
  0: ({ points }) => ({
    title: `You have earned ${points} points`,
    body: "",
    path: "Leaderboard",
    shoutout: false,
  }),
  1: ({ points }) => ({
    title: `Invite claimed`,
    body: `Your friend has accepted your invite and joined SendIt. You have earned ${points} XP.`,
    path: "",
    shoutout: false,
  }),
  2: ({ points }) => ({
    title: "Tokens sent",
    body: `You have sent tokens to your friend. You have earned ${points} XP.`,
    path: "History",
    shoutout: false,
  }),
  3: ({ points }) => ({
    title: "Tokens received",
    body: `You have received tokens from your friend. You have earned ${points} XP.`,
    path: "History",
    shoutout: false,
  }),
  4: ({ points }) => ({
    title:
      points === 10 ? "10 transactions completed" : "5 transactions completed",
    body:
      points === 10
        ? `Congratulations on completing 10 transactions. You have earned ${points} XP!`
        : `Congratulations on completing 5 transactions. You have earned ${points} XP!`,
    path: "History",
    shoutout: false,
  }),
  5: () => ({
    title: "Sent to 5 Users",
    body: "Congratulations on sending invite to 5 new users on SendIt. You have earned 50 XP!",
    path: "History",
    shoutout: false,
  }),
  6: () => ({
    title: "Invite Claimed",
    body: "You invitee has accepted your invite to join SendIt. You have earned 40 XP!",
    path: "",
    shoutout: false,
  }),
  7: () => ({
    title: "10,000th Transaction",
    body: "Congratulations on being the sender for the 10,000 SendIt transaction! You have earned 50 XP!",
    path: "History",
    shoutout: false,
  }),
  8: () => ({
    title: "100,000th Wallet",
    body: "Congratulations on being the sender who created the 100,000 wallet on SendIt! You have earned 50 XP!",
    path: "History",
    shoutout: false,
  }),
  10: ({ points }) => {
    return {
      title: "Referral Claimed",
      body: `Congratulations, your referral was claimed. You have earned ${points} XP.`,
      path: "",
      shoutout: false,
    };
  },
  11: ({ points }) => ({
    title: "Tokens sent",
    body: `You have sent tokens to your friend. You have earned ${points} XP.`,
    path: "History",
    shoutout: false,
  }),
  16: ({ points }) => ({
    title: "Shoutout Verified",
    body: `Congratulations on making a verified shoutout! You have earned ${points} XP.`,
    path: "",
    shoutout: false,
  }),
  17: ({ points }) => ({
    title: "First Transaction",
    body: `Congratulations on completing your first transaction! You have earned ${points} XP.`,
    path: "",
    shoutout: false,
  }),
  18: ({ points }) => ({
    title: "Twitter handle verified",
    body: `You have earned ${points} XP for following our Twitter handle.`,
    path: "",
    shoutout: false,
  }),
  256: ({ from, wei, chain_id, tx_info }) => {
    const currency = getCurrency(chain_id, tx_info);
    const amount = formatUnits(hexlify(wei), getDecimals(tx_info));
    const fromAddress = hexlify(from).toString();
    const truncatedFromAddress = truncateAddress(fromAddress);
    return {
      title: `Received ${currency}`,
      body: `You have received ${beautifyAmount(
        amount
      )} ${currency} from ${truncatedFromAddress}.`,
      path: "History",
      shoutout: true,
    };
  },
  272: ({ nft_value, points }) => ({
    title: "NFT Claimed",
    body: `You have converted ${points} XP into ${nft_value}.`,
    shoutout: false,
  }),
  273: ({ nft_value }) => ({
    title: "NFT Awarded",
    body: `	
Congratulations on being one of the weekly winners! You have received a ${nft_value} $XAR NFT!`,
    path: "My Rewards",
    shoutout: false,
  }),
  274: ({ nft_value }) => ({
    title: "NFT Awarded",
    body: `	
Congratulations on being one of the top 2000 users through the first few weeks of SendIt! You have received a ${nft_value} $XAR NFT!`,
    path: "My Rewards",
    shoutout: false,
  }),
  512: ({ final_fulfiller, points }) => ({
    path: "History",
    title: "Request fulfilled",
    body: `Your request has been fulfilled by ${truncateAddress(
      hexlify(final_fulfiller)
    )}. You have earned ${points} XP.`,
  }),
  513: ({ points }) => ({
    title: "10 Transactions completed",
    body: `Congratulations on completing 10 transactions on #Sendit successfully! You have earned ${points} XP as a bonus.`,
    path: "",
    shoutout: false,
  }),
  514: ({ points }) => ({
    title: "25 Transactions completed",
    body: `Congratulations on completing 25 transactions on #Sendit successfully! You have earned ${points} XP as a bonus.`,
    path: "",
    shoutout: false,
  }),
  515: ({ points }) => ({
    title: "50 Transactions completed",
    body: `Congratulations on completing 50 transactions on #Sendit successfully! You have earned ${points} XP as a bonus.`,
    path: "",
    shoutout: false,
  }),
  4096: ({ points }) => ({
    title: "Daily task completed",
    body: `Congratulations on completing 50 transactions today. You have earned ${points} XP!`,
    path: "",
    shoutout: false,
  }),
  4097: ({ points }) => ({
    title: "Daily task completed",
    body: `Congratulations on completing 10 transactions more than $10 today. You have earned ${points} XP!`,
    path: "",
    shoutout: false,
  }),
};

export default notificationsContent;
