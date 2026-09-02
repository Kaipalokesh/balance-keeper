export function nextExpenseId() {
  return `e-${Date.now()}`;
}

export function nextMemberId(members) {
  const max = members.reduce((m, x) => (x.id > m ? x.id : m), 0);
  return max + 1;
}

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
