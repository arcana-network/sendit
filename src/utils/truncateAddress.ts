export function truncateAddress(str: string, len = 6) {
  return `${str.slice(0, len)}......${str.slice(-len)}`;
}
