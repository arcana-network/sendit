import NavigationIcon from "@/assets/images/icons/navigation.svg";
import UserAddIcon from "@/assets/images/icons/user-add.svg";
import UserVoiceIcon from "@/assets/images/icons/user-voice.svg";
import TwitterGreyBgIcon from "@/assets/images/icons/twitter-grey-bg.svg";
// import TelegramGreyBgIcon from "@/assets/images/icons/telegram-grey-bg.svg";

const EARN_XP_SEND_FORM = [
  {
    image: TwitterGreyBgIcon,
    name: "Earn 20 XP",
    description: "Earn 20 XP for following us on Twitter.",
    task: "Follow",
    url: "https://twitter.com/ArcanaNetwork",
    xp: 20,
    medium: "twitter",
  },
  {
    image: NavigationIcon,
    name: "Earn 150 XP",
    description: "Send crypto for the first time and earn XP.",
    task: "",
  },
  {
    image: UserVoiceIcon,
    name: "Earn 100 XP",
    description:
      "Shout out on Twitter after a SendIt transaction for the first time and earn XP.",
    task: "",
  },
  {
    image: UserAddIcon,
    name: "Earn 10% XP",
    description:
      "Invite/refer a user and earn 10% XP of all XP they earn from performing transactions.",
    task: "invite",
  },
  // {
  //   image: NavigationIcon,
  //   name: "Earn $XAR",
  //   description: "Top 500 members on the SendIt weekly leaderboard earns XAR.",
  //   task: "",
  //   xp: 50,
  // },
];

const EARN_XP = [
  {
    image: UserAddIcon,
    name: "Earn 10% XP",
    description:
      "Invite/refer a user and earn 10% XP of all XP they earn from performing transactions.",
    task: "Invite",
    xp: 50,
  },
  {
    image: NavigationIcon,
    name: "Earn 100 XP",
    description:
      "Earn 100 XP for performing a txn to a new user on mainnet. 10 XP immediately on sending and 90 XP when the recipient logs in to SendIt.",
    task: "Transact",
    xp: 100,
  },
  {
    image: NavigationIcon,
    name: "Earn 10 XP",
    description:
      "Earn 10 XP for performing a txn to an existing user on mainnet.",
    task: "Transact",
    xp: 10,
  },
  {
    image: NavigationIcon,
    name: "Earn 20 XP",
    description:
      "Earn 20 XP for performing a txn to a new user on testnet. 2 XP immediately on sending and 18 XP when the recipient logs in to SendIt.",
    task: "Transact",
    xp: 20,
  },
  {
    image: NavigationIcon,
    name: "Earn 500 XP",
    description: "Send crypto for the first time and earn XP.",
    task: "Transact",
    xp: 500,
  },
  // {
  //   image: NavigationIcon,
  //   name: "Earn $XAR",
  //   description: "Top 500 members on the SendIt weekly leaderboard earns XAR.",
  //   task: "Transact",
  //   xp: 50,
  // },
  {
    image: NavigationIcon,
    name: "Earn 2 XP",
    description:
      "Earn 2 XP for performing a txn to an existing user on testnet.",
    task: "Transact",
    xp: 2,
  },
  {
    image: UserVoiceIcon,
    name: "Earn 2 XP",
    description:
      "Shout out on Twitter after a send/receive transaction & earn XP.",
    task: "History",
    xp: 5,
  },
  {
    image: TwitterGreyBgIcon,
    name: "Earn 20 XP",
    description: "Earn 20 XP for following us on Twitter.",
    task: "Follow",
    url: "https://twitter.com/ArcanaNetwork",
    xp: 20,
    medium: "twitter",
  },
  // {
  //   image: TelegramGreyBgIcon,
  //   name: "Earn 20 XP",
  //   description: "Earn 20 XP for following us on Telegram.",
  //   task: "Follow",
  //   url: "https://t.me/ArcanaNetwork",
  //   xp: 20,
  //   medium: "telegram",
  // },
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
    image: "/xars/500XAR.png",
    name: "500 XAR NFT",
    requiredXP: 5000,
    xar: 500,
  },
];

export { EARN_XP, REDEEM_XP, EARN_XP_SEND_FORM };
