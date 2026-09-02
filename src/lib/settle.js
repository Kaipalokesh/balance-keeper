/**
 * Settle-Up Engine: Suggests the minimum set of direct peer-to-peer transfers
 * to resolve all debts across the group using a greedy min-cash-flow algorithm.
 */
export function suggestSettlements(balances, members) {
  // Helper to resolve member ID to display name with fallback
  const nameOf = (id) => members.find((m) => m.id === id)?.name ?? `#${id}`;

  const debtors = [];   // members who owe money (net balance < 0)
  const creditors = []; // members who are owed money (net balance > 0)

  // Partition members into debtors and creditors with floating-point epsilon (0.001)
  for (const [id, raw] of Object.entries(balances)) {
    const amount = Number(raw);
    const memberId = Number(id);
    if (amount < -0.001) debtors.push({ id: memberId, amount: -amount });
    else if (amount > 0.001) creditors.push({ id: memberId, amount });
  }

  // Sort descending by amount so largest debts/credits get settled first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let i = 0; // debtor pointer
  let j = 0; // creditor pointer

  // Greedy match: settle the overlap between maximum debtor and maximum creditor
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i];
    const c = creditors[j];

    if (d.amount > c.amount) {
      // Debtor owes more than creditor is owed -> satisfy creditor completely
      transfers.push({
        from: d.id,
        to: c.id,
        fromName: nameOf(d.id),
        toName: nameOf(c.id),
        amount: c.amount,
      });
      d.amount -= c.amount;
      j += 1;
    } else if (d.amount < c.amount) {
      // Debtor owes less than creditor is owed -> debtor is completely settled
      transfers.push({
        from: d.id,
        to: c.id,
        fromName: nameOf(d.id),
        toName: nameOf(c.id),
        amount: d.amount,
      });
      c.amount -= d.amount;
      i += 1;
    } else {
      // Exact match: both debtor and creditor are settled simultaneously
      transfers.push({
        from: d.id,
        to: c.id,
        fromName: nameOf(d.id),
        toName: nameOf(c.id),
        amount: d.amount,
      });
      i += 1;
      j += 1;
    }
  }

  return transfers;
}
