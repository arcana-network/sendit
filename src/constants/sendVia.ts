import MailIcon from "@/assets/images/icons/mail.svg";
import TwitterIcon from "@/assets/images/icons/twitter.svg";

type SendMedium = {
  icon: string;
  value: "mail" | "twitter";
};

const sendMedium: SendMedium[] = [
  {
    icon: MailIcon,
    value: "mail",
  },
  {
    icon: TwitterIcon,
    value: "twitter",
  },
];

export default sendMedium;
