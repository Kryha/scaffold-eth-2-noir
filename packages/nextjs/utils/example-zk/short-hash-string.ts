export function shortenHashString(hash: string) {
  const prefix = hash.substring(0, 2);
  const suffix = hash.substring(hash.length - 4);

  return prefix + "..." + suffix;
}
