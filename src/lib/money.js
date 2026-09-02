/**
 * Formats numeric currency values with 2 decimal places.
 * Handles negative balances and NaN/invalid inputs safely.
 */
export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

/**
 * Splits an expense equally across an array of participant IDs.
 * Uses remainder allocation to ensure sum(shares) === amount exactly (no penny loss).
 */
export function splitEqual(amount, ids) {
  const n = ids.length || 1;
  const share = Number((amount / n).toFixed(2));
  const shares = {};

  ids.forEach((id, i) => {
    // The last person absorbs any fractional penny remainder (e.g. $100 / 3 -> $33.33, $33.33, $33.34)
    shares[id] = i === ids.length - 1 ? Number((amount - share * (ids.length - 1)).toFixed(2)) : share;
  });

  return shares;
}

/**
 * Validates whether percentage splits sum up to 100% within a 0.01 tolerance
 * to account for standard JS floating-point precision issues (e.g. 99.99999% or 100.0001%).
 */
export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01;
}

/**
 * Splits an expense proportionally based on a map of custom percentages.
 * Allocates exact remainder to the last participant to guarantee zero financial drift.
 */
export function splitByPercent(amount, percents) {
  const shares = {};
  const ids = Object.keys(percents);
  let totalAllocated = 0;

  // Allocate all shares except the last participant
  ids.slice(0, -1).forEach((id) => {
    const share = Number(((amount * Number(percents[id])) / 100).toFixed(2));
    shares[id] = share;
    totalAllocated += share;
  });

  // Assign remaining balance to last participant
  if (ids.length > 0) {
    shares[ids[ids.length - 1]] = Number((amount - totalAllocated).toFixed(2));
  }

  return shares;
}

/**
 * Resolves participant shares according to the expense split strategy.
 */
export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}
