import { Fraction } from "../../sdk/index.mjs";
export function getAmountDistribution(amount, distributionPercent) {
  const percents = [];
  const amounts = [];
  for (let i = 1; i <= 100 / distributionPercent; i++) {
    percents.push(i * distributionPercent);
    amounts.push(amount.multiply(new Fraction(i * distributionPercent, 100)));
  }
  return [percents, amounts];
}
