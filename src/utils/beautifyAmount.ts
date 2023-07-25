function humanizeAmount(amount: string) {
  if (amount.length > 9) {
    return `${amount.substring(0, amount.length - 9)}.${amount.substring(
      amount.length - 9,
      amount.length - 7
    )}B`;
  }
  if (amount.length > 6) {
    return `${amount.substring(0, amount.length - 6)}.${amount.substring(
      amount.length - 6,
      amount.length - 4
    )}M`;
  }
  if (amount.length > 3) {
    return `${amount.substring(0, amount.length - 3)}.${amount.substring(
      amount.length - 3,
      amount.length - 1
    )}K`;
  }
  return amount;
}

function beautifyAmount(amount: string) {
  if (amount.includes(".")) {
    const [beforeDecimal, afterDecimal] = amount.split(".");
    if (beforeDecimal.length > 3) return humanizeAmount(beforeDecimal);
    if (afterDecimal.length > 6) {
      let lastDigit =
        Number(afterDecimal[5]) === 0 && Number(afterDecimal[6]) > 5
          ? "1"
          : afterDecimal[5];
      if (Number(lastDigit) === 0) {
        lastDigit = "1";
      }
      return `${beforeDecimal}.${afterDecimal.slice(0, 5)}${lastDigit}`;
    }
    return amount;
  }
  return humanizeAmount(amount);
}

export { beautifyAmount };
