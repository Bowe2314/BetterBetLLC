import { useState, useCallback } from "react";

export function useCasino() {
  const getUser = () => JSON.parse(localStorage.getItem("casino_user") || "{}");
  const [balance, setBalance] = useState(getUser().balance || 0);

  const updateBalance = useCallback((newBalance) => {
    const user = getUser();
    user.balance = newBalance;
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem("casino_users") || "[]");
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      localStorage.setItem("casino_users", JSON.stringify(users));
    }
    
    // Update current user
    localStorage.setItem("casino_user", JSON.stringify(user));
    setBalance(newBalance);
    window.dispatchEvent(new Event("balanceUpdate"));
  }, []);

  const addHistory = useCallback((entry) => {
    const history = JSON.parse(localStorage.getItem("casino_history") || "[]");
    history.unshift({
      ...entry,
      timestamp: new Date().toISOString(),
      userId: getUser().id
    });
    localStorage.setItem("casino_history", JSON.stringify(history));
  }, []);

  return { balance, updateBalance, addHistory, getUser };
}