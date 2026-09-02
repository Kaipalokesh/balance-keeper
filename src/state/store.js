const KEY = "fairshare-v1";

/**
 * Hydrates serialized state from localStorage by restoring native Date objects on expenses.
 */
function hydrate(data) {
  return {
    groupName: data.groupName,
    members: data.members.map((m) => ({ ...m })),
    expenses: data.expenses.map((e) => ({
      ...e,
      date: new Date(e.date),
    })),
  };
}

/**
 * Loads persistent state from localStorage or falls back to the initial seed dataset.
 */
export function loadState(seed) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const initial = hydrate(seed);
      localStorage.setItem(KEY, JSON.stringify(initial));
      return initial;
    }
    return hydrate(JSON.parse(raw));
  } catch {
    return hydrate(seed);
  }
}

/**
 * Serializes and syncs application state to browser localStorage.
 */
export function persistState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

/**
 * Generates unique timestamp-based expense ID.
 */
export function nextExpenseId() {
  return `e-${Date.now()}`;
}

/**
 * Calculates next incremental member ID.
 */
export function nextMemberId(members) {
  const max = members.reduce((m, x) => (x.id > m ? x.id : m), 0);
  return max + 1;
}

/**
 * Central state reducer handling expenses (add, update, delete) and new members.
 */
export function reducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE": {
      return { ...state, expenses: [...state.expenses, action.expense] };
    }
    case "DELETE_EXPENSE": {
      const next = state.expenses.slice();
      next.splice(action.index, 1);
      return { ...state, expenses: next };
    }
    case "UPDATE_EXPENSE": {
      const next = state.expenses.slice();
      next[action.index] = { ...next[action.index], ...action.patch };
      return { ...state, expenses: next };
    }
    case "ADD_MEMBER": {
      return { ...state, members: [...state.members, action.member] };
    }
    default:
      return state;
  }
}
