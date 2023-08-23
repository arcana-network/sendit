import NavigationIcon from "@/assets/images/icons/navigation.svg";
import UserAddIcon from "@/assets/images/icons/user-add.svg";
import UserVoiceIcon from "@/assets/images/icons/user-voice.svg";
import TwitterGreyBgIcon from "@/assets/images/icons/twitter-white.svg";

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
    image: NavigationIcon,
    name: "SendIT to a new user on Mainnet",
    description: "Earn 50XP by sending to a new user.",
    task: "Transact",
    xp: 50,
    dailyLimit: 500,
    bonus: "Get 10% of all XP earned by the new user.",
  },
  {
    image: NavigationIcon,
    name: "SendIT to an existing user on Mainnet",
    description: "Earn 50XP by sending to an existing user.",
    task: "Transact",
    xp: 50,
    dailyLimit: 500,
  },
  {
    image: NavigationIcon,
    name: "SendIT to a new user on Testnet",
    description: "Earn 10XP by sending to a new user.",
    task: "Transact",
    xp: 10,
    dailyLimit: 100,
    bonus: "Get 10% of all XP earned by the new user.",
  },
  {
    image: NavigationIcon,
    name: "SendIT to an existing user on Testnet",
    description: "Earn 10XP by sending to an existing user.",
    task: "Transact",
    xp: 10,
    dailyLimit: 100,
  },
  {
    image: TwitterGreyBgIcon,
    name: "Shoutout on Twitter",
    description:
      "Earn 5XP by doing a shoutout on Twitter after every transaction.",
    task: "Shoutout",
    xp: 5,
    dailyLimit: 50,
  },
  {
    image: TwitterGreyBgIcon,
    name: "Follow Arcana on Twitter",
    description: "Earn 20XP by following Arcana Network on Twitter.",
    task: "Follow",
    xp: 20,
    url: "https://twitter.com/ArcanaNetwork",
    medium: "twitter",
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
    image: "/xars/500XAR.png",
    name: "500 XAR NFT",
    requiredXP: 5000,
    xar: 500,
  },
];

export { EARN_XP, REDEEM_XP, EARN_XP_SEND_FORM };
