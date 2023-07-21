import { toASCII } from "punycode";

function isValidEmail(email: string) {
  if (email.includes("@")) {
    const splitEmails = email.split("@");
    let decodedEmail = "";
    if (
      splitEmails[0].startsWith(".") ||
      splitEmails[0].endsWith(".") ||
      splitEmails[0].length === 0
    ) {
      return false;
    }
    if (splitEmails[1].length > 0) {
      decodedEmail = `@${toASCII(splitEmails[1])}`;
    } else {
      return false;
    }
    return /^(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([\w]{2,24}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i.test(
      decodedEmail
    );
  }
  return false;
}

function isValidTwitterHandle(handle: string) {
  if (handle.startsWith("@")) {
    handle = handle.slice(1);
  }
  return /^[a-zA-Z0-9_]{1,15}$/.test(handle);
}

export { isValidEmail, isValidTwitterHandle };
