"use client"

import { useEffect, useState } from "react";
import { getCurrentUser, isLoggedIn, getCurrentUserRole } from "./Auth";
import UserContext from "./UserContext";

function UserProvider({ children }) {
  const [user, setUser] = useState({ data: null, login: false });
  const [role, setRole] = useState(null);

  useEffect(() => {
    const current = getCurrentUser();
    const login = isLoggedIn();
    const r = login ? getCurrentUserRole() : null;

    setUser({ data: current, login });
    setRole(r);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
