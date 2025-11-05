"use client"

import { createContext } from "react";

const UserContext = createContext({
  user: { data: null, login: false },
  setUser: () => {},
  role: null,
  setRole: () => {},
});

export default UserContext;
