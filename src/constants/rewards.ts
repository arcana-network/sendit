import NavigationIcon from "@/assets/images/icons/navigation.svg";
import UserAddIcon from "@/assets/images/icons/user-add.svg";
import UserVoiceIcon from "@/assets/images/icons/user-voice.svg";

const EARN_XP_SEND_FORM = [
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
    name: "Earn 50 XP",
    description:
      "Invite a friend and earn XP as soon as they log in to their wallet.",
    task: "invite",
  },
];

const EARN_XP = [
  {
    image: UserAddIcon,
    name: "Earn 50 XP",
    description:
      "Invite a friend and earn XP as soon as they log in to their wallet.",
    task: "Invite",
    xp: 50,
  },
  {
    image: UserAddIcon,
    name: "Earn 500 XP",
    description:
      "Invite 10 friends and earn XP once all of them log in to their wallet.",
    task: "Invite",
    xp: 500,
  },
  {
    image: UserAddIcon,
    name: "Earn 5000 XP",
    description:
      "First 100 people to reach 25 claimed invites (invitee should have logged in) earn XP.",
    task: "Invite",
    xp: 5000,
  },
  {
    image: UserAddIcon,
    name: "Earn 10000 XP",
    description:
      "First 100 people to reach 50 claimed invites (invitee should have logged in) earn XP.",
    task: "Invite",
    xp: 10000,
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
    name: "Earn 150 XP",
    description: "Send crypto for the first time and earn XP.",
    task: "Transact",
    xp: 150,
  },
  {
    image: NavigationIcon,
    name: "Earn 25 XP",
    description: "Send crypto to a unique address and earn XP.",
    task: "Transact",
    xp: 25,
  },
  {
    image: NavigationIcon,
    name: "Earn 100 XP",
    description: "Complete 10 transactions on SendIt and earn XP.",
    task: "Transact",
    xp: 100,
  },
  {
    image: NavigationIcon,
    name: "Earn 250 XP",
    description: "Complete 25 transactions on SendIt and earn XP.",
    task: "Transact",
    xp: 250,
  },
  {
    image: NavigationIcon,
    name: "Earn 500 XP",
    description: "Complete 50 transactions on SendIt and earn XP.",
    task: "Transact",
    xp: 500,
  },
  {
    image: NavigationIcon,
    name: "Earn 250 XP",
    description:
      "Earn 100th transaction performed through SendIt in a day earns XP.",
    task: "Transact",
    xp: 250,
  },
  {
    image: UserVoiceIcon,
    name: "Earn 100 XP",
    description:
      "Shout out on Twitter after a SendIt transaction for the first time and earn XP.",
    task: "Transact",
    xp: 100,
  },
  {
    image: UserVoiceIcon,
    name: "Earn 25 XP",
    description: "Shoutout a SendIt send transaction on twitter & earn XP.",
    task: "Transact",
    xp: 25,
  },
  {
    image: UserVoiceIcon,
    name: "Earn 25 XP",
    description: "Shoutout a SendIt receive transaction on twitter & earn XP.",
    task: "Transact",
    xp: 25,
  },
  {
    image: NavigationIcon,
    name: "Earn 50 XP",
    description: "Top 500 members on the SendIt weekly leaderboard earns XP.",
    task: "Transact",
    xp: 50,
  },
  {
    image: NavigationIcon,
    name: "Earn 30 XP",
    description: "Top 1000 members on the SendIt weekly leaderboard earns XP.",
    task: "Transact",
    xp: 30,
  },
  {
    image: NavigationIcon,
    name: "Earn 20 XP",
    description: "Top 3000 members on the SendIt weekly leaderboard earns XP.",
    task: "Transact",
    xp: 20,
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
    requiredXP: 500,
    xar: 5000,
  },
];

export { EARN_XP, REDEEM_XP, EARN_XP_SEND_FORM };
