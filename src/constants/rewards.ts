import NavigationIcon from "@/assets/images/icons/navigation.svg";
import PiggyBankIcon from "@/assets/images/icons/piggy-bank.svg";
import UserAddIcon from "@/assets/images/icons/user-add.svg";
import UserVoiceIcon from "@/assets/images/icons/user-voice.svg";
import WalletIcon from "@/assets/images/icons/wallet.svg";

const EARN_XP = [
  {
    image: UserAddIcon,
    name: "Earn 40 XP",
    description:
      "Invite a friend and earn XP as soon as they log in to their wallet.",
    task: "Invite",
  },
  {
    image: UserVoiceIcon,
    name: "Earn 50 XP",
    description:
      "Give a shoutout to sender when you receive assets to earn XP.",
    task: "Tweet",
    tweet: "Welcome to Sendit! I just received assets from @sender. #Sendit",
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Send crypto & earn by making a new transaction.",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Earn with every 10 successful transactions (per user).",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 10 XP",
    description: "Earn with every 5 transactions.",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "Send to 5 people to earn points.",
    task: "Transact",
  },
  {
    image: UserAddIcon,
    name: "Earn 30 XP",
    description: "Earn with every 10 successful invites.",
    task: "Invite",
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Send 100$ totally (per user).",
    task: "Transact",
  },
  {
    image: PiggyBankIcon,
    name: "Earn 50 XP",
    description: "1,000,000 USD crossed in volume.",
    task: "Transact",
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "10,000th txn (overall).",
    task: "Transact",
  },
  {
    image: WalletIcon,
    name: "Earn 50 XP",
    description: "100,000th wallet (overall).",
    task: "Transact",
  },
];

const REDEEM_XP = [
  {
    image: "https://via.placeholder.com/93X96",
    name: "25 XAR NFT",
    requiredXP: 500,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "50 XAR NFT",
    requiredXP: 500,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "75 XAR NFT",
    requiredXP: 1000,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "100 XAR NFT",
    requiredXP: 1000,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "125 XAR NFT",
    requiredXP: 1000,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "150 XAR NFT",
    requiredXP: 1000,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "175 XAR NFT",
    requiredXP: 1000,
  },
];

export { EARN_XP, REDEEM_XP };
