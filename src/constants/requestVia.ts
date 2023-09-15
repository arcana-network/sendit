import MailIcon from "@/assets/images/icons/mail-white.svg";
import TwitterIcon from "@/assets/images/icons/twitter-white.svg";
import WalletIcon from "@/assets/images/icons/wallet.svg";

type RequestMedium = {
  icon: string;
  value: "mail" | "twitter" | "wallet";
};

const requestMedium: RequestMedium[] = [
  {
    icon: MailIcon,
    value: "mail",
  },
  {
    icon: TwitterIcon,
    value: "twitter",
  },
  {
    icon: WalletIcon,
    value: "wallet",
  },
];

export default requestMedium;
