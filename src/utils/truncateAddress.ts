export function truncateAddress(str: string) {
  return `${str.slice(0, 6)}......${str.slice(-6)}`;
}
