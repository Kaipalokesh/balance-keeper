import { sharesForExpense } from "./money.js";

/**
 * Computes individual net balances for all group members across all expenses.
 * 
 * Rules:
 * 1. Payer gets credited full amount (+exp.amount).
 * 2. Each participant carrying a share gets debited their exact share (-share).
 * 3. Works seamlessly even if the payer is not part of the split (non-participant payer).
 */
export function computeBalances(members, expenses) {
  // Initialize balance ledger for all active members
  const bal = {};
  for (const m of members) bal[m.id] = 0;

  for (const exp of expenses) {
    const shares = sharesForExpense(exp);

    // Credit full amount paid to payer
    bal[exp.paidBy] = (bal[exp.paidBy] || 0) + Number(exp.amount);

    // Debit each consumer their respective portion
    for (const [id, share] of Object.entries(shares)) {
      const key = Number(id);
      bal[key] = (bal[key] || 0) - share;
    }
  }

  return bal;
}

/**
 * Sums the total expenses across all records.
 */
export function totalSpent(expenses) {
  return expenses.reduce((s, e) => s + Number(e.amount), 0);
}
