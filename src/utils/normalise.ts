import { toUnicode } from "punycode";

function normaliseEmail(email: string) {
  return toUnicode(email.toLowerCase().trim());
}

function normaliseTwitterHandle(handle: string) {
  if (!handle.startsWith("@")) {
    return `@${handle}`;
  }
  return handle;
}

export { normaliseEmail, normaliseTwitterHandle };
