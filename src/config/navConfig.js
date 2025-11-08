export const pagesBase = [
  { label: "Home", path: "/" },
  { label: "Discover", path: "/discover" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

// Generate settings dynamically based on role
export const getUserSettings = (role) => [
  { label: "Profile", path: "/user/profile", type: "link" },
  {
    label: "Dashboard",
    path: role === "ADMIN" ? "/admin/dashboard" : "/user/dashboard",
    type: "link",
  },
  { label: "Logout", path: "/logout", type: "action" },
];