# Bugs found

Add one section per issue. Bug 1 is filled in to show the format — fix it, then write what you changed. Copy the blank template for the rest.

Keep this file in the repo and **commit it** with your fixes.

---

## Bug 1

**How to reproduce:** Open the app. The expense list says “Newest first”. The first row is Wine (7 Mar). Board game (15 Mar) is further down.

**What is wrong:** The list is showing oldest expenses first. Newest should be at the top.

**What I changed:** Fixed the sorting in [src/components/ExpenseList.jsx](src/components/ExpenseList.jsx#L59) - changed `sort((a, b) => dateValue(a.date) - dateValue(b.date))` to `sort((a, b) => dateValue(b.date) - dateValue(a.date))` to reverse the sort order and show newest expenses first.

---

## Bug 2

**How to reproduce:** Add expenses where the settlement amounts are exactly equal (e.g., two people where each owes the other exactly the same amount). The settle-up list will not show the required transfer for that pair.

**What is wrong:** The settlement algorithm in [src/lib/settle.js](src/lib/settle.js#L30-L34) has a missing transfer in the else clause when debtor amount equals creditor amount. The algorithm skips adding a transfer when amounts are equal.

**What I changed:** Added the missing `transfers.push()` call in the else clause (when d.amount === c.amount) in [src/lib/settle.js](src/lib/settle.js). This ensures transfers are recorded even when debtor and creditor amounts are exactly equal.

---

## Bug 3

**How to reproduce:** Have person A pay for a cab ride ($60) used only by persons B and C. Check the balances panel. Person A should be owed $60 (for paying the full amount), but instead shows less.

**What is wrong:** The balance calculation in [src/lib/balances.js](src/lib/balances.js) was incorrectly subtracting a portion from the payer even when they're not part of the split. The README spec clearly states: "They should get that fare back in full. Only the people who used it should owe a share."

**What I changed:** Removed the buggy condition (lines 15-18) in [src/lib/balances.js](src/lib/balances.js) that was subtracting from the payer's balance when they weren't included in the split.

---

## Bug 4

**How to reproduce:** Add an expense, then refresh the page. Try to add another expense. The sorting might break or dates won't display correctly.

**What is wrong:** In [src/state/store.js](src/state/store.js#L17), when data is loaded from localStorage, `JSON.parse()` converts Date objects back to strings. Sorting by date then fails because `dateValue()` receives strings, not Date objects.

**What I changed:** Modified `loadState()` in [src/state/store.js](src/state/store.js#L17) to call `hydrate()` on the parsed data so dates are properly converted to Date objects.

---

## Bug 5

**How to reproduce:** After adding an expense and refreshing, try sorting - the sort breaks with string dates.

**What is wrong:** The `dateValue()` function in [src/lib/format.js](src/lib/format.js#L14) doesn't reliably return a numeric value. It should convert dates to timestamps for consistent arithmetic comparisons.

**What I changed:** Updated `dateValue()` in [src/lib/format.js](src/lib/format.js) to return `date.getTime()` for Date objects and `new Date(date).getTime()` for strings, ensuring numeric comparison works correctly.

---

## Bug 6

**How to reproduce:** Add an expense with a description and amount. Click "Save expense". The form still shows the same description and amount.

**What is wrong:** The form doesn't reset after successfully adding an expense, confusing users about whether their input was saved.

**What I changed:** Added form reset logic in [src/components/AddExpenseForm.jsx](src/components/AddExpenseForm.jsx) after `onAdd()` is called: clears description, amount, and error state.

---

## Bug 7

**How to reproduce:** Create expenses with percentages that sum to 99.99 or 100.01. Try to save - the validation rejects them even though rounding is legitimate.

**What is wrong:** The `percentsSumTo100()` function in [src/lib/money.js](src/lib/money.js) checks for exact equality (===100), but floating-point arithmetic creates values like 99.99999999 or 100.00000001.

**What I changed:** Modified `percentsSumTo100()` in [src/lib/money.js](src/lib/money.js) to allow a tolerance of 0.01 using `Math.abs(sum - 100) < 0.01`.

---

## Bug 8

**How to reproduce:** Create an expense of $100 split equally among 3 people. Check balances - the total owed might be $99.99 instead of $100 (money is lost).

**What is wrong:** The `splitEqual()` function in [src/lib/money.js](src/lib/money.js) gives each person the same rounded amount. If $100 ÷ 3 = $33.33 per person, that's only $99.99 total. Money is lost to rounding.

**What I changed:** Updated `splitEqual()` in [src/lib/money.js](src/lib/money.js) to give the last person the remainder amount, ensuring the total always equals the original amount exactly.

---

## Bug 9

**How to reproduce:** Create an expense with custom percentages split. Check the balances - the total owed might not equal the expense amount due to rounding.

**What is wrong:** The `splitByPercent()` function in [src/lib/money.js](src/lib/money.js) rounds each share independently, losing money to rounding errors.

**What I changed:** Updated `splitByPercent()` in [src/lib/money.js](src/lib/money.js) to allocate shares to all but the last person, then give the last person the remainder. This ensures the total always equals the original amount.

---
