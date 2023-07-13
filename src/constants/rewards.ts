import NavigationIcon from "@/assets/images/icons/navigation.svg";
import PiggyBankIcon from "@/assets/images/icons/piggy-bank.svg";
import UserAddIcon from "@/assets/images/icons/user-add.svg";
// import UserVoiceIcon from "@/assets/images/icons/user-voice.svg";
import WalletIcon from "@/assets/images/icons/wallet.svg";

const EARN_XP = [
  {
    image: UserAddIcon,
    name: "Earn 40 XP",
    description:
      "Invite a friend and earn XP as soon as they log in to their wallet.",
    task: "Invite",
    xp: 50,
  },
  // {
  //   image: UserVoiceIcon,
  //   name: "Earn 50 XP",
  //   description:
  //     "Give a shoutout to sender when you receive assets to earn XP.",
  //   task: "Tweet",
  //   tweet:
  //     "Just received a crypto transfer on #SendIt! No wallet, no problem. Join the revolution at https://sendit.arcana.network!",
  //   xp: 50,
  // },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Send crypto & earn by making a new transaction.",
    task: "Transact",
    xp: 30,
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Earn with every 10 successful transactions (per user).",
    task: "Transact",
    xp: 30,
  },
  {
    image: NavigationIcon,
    name: "Earn 10 XP",
    description: "Earn with every 5 transactions.",
    task: "Transact",
    xp: 10,
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "Send to 5 people to earn points.",
    task: "Transact",
    xp: 50,
  },
  {
    image: UserAddIcon,
    name: "Earn 30 XP",
    description: "Earn with every 10 successful invites.",
    task: "Invite",
    xp: 30,
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Send 100$ totally (per user).",
    task: "Transact",
    xp: 30,
  },
  {
    image: PiggyBankIcon,
    name: "Earn 50 XP",
    description: "1,000,000 USD crossed in volume.",
    task: "Transact",
    xp: 50,
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "10,000th txn (overall).",
    task: "Transact",
    xp: 50,
  },
  {
    image: WalletIcon,
    name: "Earn 50 XP",
    description: "100,000th wallet (overall).",
    task: "Transact",
    xp: 50,
  },
];

const REDEEM_XP = [
  {
    image: "/xars/25XAR.png",
    name: "25 XAR NFT",
    requiredXP: 250,
    xar: 25,
  },
  {
    image: "/xars/50XAR.png",
    name: "50 XAR NFT",
    requiredXP: 500,
    xar: 50,
  },
  {
    image: "/xars/100XAR.png",
    name: "100 XAR NFT",
    requiredXP: 1000,
    xar: 100,
  },
  {
    image: "https://via.placeholder.com/93X96",
    name: "125 XAR NFT",
    requiredXP: 500,
    xar: 5000,
  },
];

export { EARN_XP, REDEEM_XP };
