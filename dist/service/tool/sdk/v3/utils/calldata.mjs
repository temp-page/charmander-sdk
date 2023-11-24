export function toHex(bigintIsh) {
  const bigInt = BigInt(bigintIsh);
  let hex = bigInt.toString(16);
  if (hex.length % 2 !== 0)
    hex = `0${hex}`;
  return `0x${hex}`;
}
