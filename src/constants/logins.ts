import googleIcon from "@/assets/images/icons/google.svg";
import twitterIcon from "@/assets/images/icons/twitter.svg";
import metamaskIcon from "@/assets/images/icons/metamask-fox.svg";
// import walletConnectIcon from "@/assets/images/icons/wallet-connect.svg";

const socialLogins = [
  {
    label: "Google",
    value: "google",
    icon: googleIcon,
  },
  {
    label: "Twitter",
    value: "twitter",
    icon: twitterIcon,
  },
];

const walletLogins = [
  {
    label: "Metamask",
    value: "metamask",
    icon: metamaskIcon,
  },
  // {
  //   label: "Wallet Connect",
  //   value: "walletconnect",
  //   icon: walletConnectIcon,
  // },
];

export { socialLogins, walletLogins };
