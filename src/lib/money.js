export function formatMoney(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export function splitEqual(amount, ids) {
  const n = ids.length || 1;
  const share = Number((amount / n).toFixed(2));
  const shares = {};
  ids.forEach((id, i) => {
    // Last person gets remainder to ensure total equals amount
    shares[id] = i === ids.length - 1 ? Number((amount - share * (ids.length - 1)).toFixed(2)) : share;
  });
  return shares;
}

export function percentsSumTo100(percents) {
  const values = Object.values(percents).map(Number);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.abs(sum - 100) < 0.01;
}

export function splitByPercent(amount, percents) {
  const shares = {};
  const ids = Object.keys(percents);
  let totalAllocated = 0;

  // Allocate all shares except the last person
  ids.slice(0, -1).forEach((id) => {
    const share = Number(((amount * Number(percents[id])) / 100).toFixed(2));
    shares[id] = share;
    totalAllocated += share;
  });

  // Last person gets remainder to ensure total equals amount
  if (ids.length > 0) {
    shares[ids[ids.length - 1]] = Number((amount - totalAllocated).toFixed(2));
  }

  return shares;
}

export function sharesForExpense(expense) {
  if (expense.splitType === "percent" && expense.percents) {
    return splitByPercent(expense.amount, expense.percents);
  }
  return splitEqual(expense.amount, expense.splitWith);
}
