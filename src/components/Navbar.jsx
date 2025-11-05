"use client";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import UserContext from "../../src/contexts/UserContext";
import UserContext from "@/contexts/UserContext";
import { doLogout } from "@/contexts/Auth";
import FocusTrap from "@/components/FocusTrap";
import { APIROUTE } from "@/config/constants";

const pagesBase = [
  { label: "Home", path: "/" },
  { label: "Discover", path: "/discover" },
  // { label: "Books", path: "/books" },
  // { label: "Authors", path: "/authors" },
  { label: "Add Author", path: "/add-author" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const settings = [
  { label: "Profile", path: "/user/profile", type: "link" },
  { label: "Account", path: "/account", type: "link" },
  { label: "Dashboard", path: "/user/dashboard", type: "link" },
  { label: "Logout", path: "/logout", type: "action" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, role: contextRole } = useContext(UserContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const userBtnRef = useRef(null);
  const firstUserItemRef = useRef(null);
  const mobilePanelRef = useRef(null);

  const effectiveRole = user?.data?.role || contextRole || null;

  const handleLogout = useCallback(() => {
    doLogout(() => {
      setUser({ data: null, login: false });
      setUserOpen(false);
      setMobileOpen(false);
      router.push("/");
    });
  }, [router, setUser]);

  const initials = useCallback(() => {
    if (!user?.data) return "U";
    const name =
      typeof user.data === "string"
        ? user.data
        : user.data.name || user.data.username || "";
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [user]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (
        userOpen &&
        userBtnRef.current &&
        !userBtnRef.current.contains(e.target) &&
        !(
          firstUserItemRef.current &&
          firstUserItemRef.current.contains(e.target)
        )
      ) {
        setUserOpen(false);
      }
    }

    function onKey(e) {
      if (e.key === "Escape") {
        setUserOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userOpen]);

  useEffect(() => {
    if (userOpen) {
      setTimeout(() => {
        firstUserItemRef.current?.focus();
      }, 0);
    } else {
      userBtnRef.current?.focus?.();
    }
  }, [userOpen]);

  useEffect(() => {
    if (mobileOpen) {
      setTimeout(() => {
        mobilePanelRef.current?.focus?.();
      }, 0);
    }
  }, [mobileOpen]);

  return (
    <header className="bg-[#F5F3E7] text-[#3E5E4D] sticky top-0 z-40 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link href={`${APIROUTE.home}`} className="flex items-center no-underline">
              <span
                className="font-['DM Serif Display'] text-2xl font-bold tracking-tight"
                aria-hidden
              >
                Mindful <span className="text-[#A8BDA5]">Reader</span>
              </span>
            </Link>
          </div>

          {/* Desktop links */}
          <nav
            className="hidden md:flex md:items-center md:space-x-8 font-medium"
            aria-label="Primary"
          >
            {pagesBase
              .filter(
                ({ label }) =>
                  label !== "Add Author" || effectiveRole === "ADMIN"
              )
              .map(({ label, path }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={label}
                    href={path}
                    className={`py-2 px-1 text-sm transition ${
                      isActive
                        ? "font-semibold border-b-2 border-[#A8BDA5]"
                        : "opacity-90 hover:opacity-100"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
          </nav>

          {/* Right area */}
          <div className="flex items-center gap-3">
            {user?.login ? (
              <div className="relative" ref={userBtnRef}>
                <button
                  id="user-menu-button"
                  onClick={() => setUserOpen((s) => !s)}
                  aria-expanded={userOpen}
                  aria-controls={userOpen ? "user-menu" : undefined}
                  aria-label="Open user menu"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-[#A8BDA5] text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E6B89C]"
                >
                  {initials()}
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-44 z-50">
                    <FocusTrap
                      active={userOpen}
                      onClose={() => setUserOpen(false)}
                    >
                      <div
                        id="user-menu"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                        className="bg-white text-[#3E5E4D] rounded-lg shadow-lg overflow-hidden"
                      >
                        {settings.map(({ label, path, type }, idx) =>
                          type === "link" ? (
                            <Link
                              key={label}
                              href={path}
                              role="menuitem"
                              ref={idx === 0 ? firstUserItemRef : undefined}
                              onClick={() => setUserOpen(false)}
                              className="block px-4 py-2 text-sm hover:bg-[#F5F3E7] focus:outline-none focus:bg-[#F5F3E7]"
                            >
                              {label}
                            </Link>
                          ) : (
                            <button
                              key={label}
                              role="menuitem"
                              ref={idx === 0 ? firstUserItemRef : undefined}
                              onClick={() => {
                                if (label === "Logout") {
                                  handleLogout();
                                } else {
                                  router.push(path);
                                }
                                setUserOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-[#F5F3E7] focus:outline-none"
                            >
                              {label}
                            </button>
                          )
                        )}
                      </div>
                    </FocusTrap>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href={`${APIROUTE.login}`}
                  className="text-sm px-3 py-1 hover:underline"
                >
                  Login
                </Link>
                <Link
                  href={`${APIROUTE.signup}`}
                  className="text-sm px-3 py-1 bg-[#A8BDA5] text-white rounded-full font-semibold hover:bg-[#8FA98B] transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-expanded={mobileOpen}
                aria-label="Toggle navigation"
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E6B89C]"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  {mobileOpen ? (
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {mobileOpen && (
                <div className="fixed left-3 right-3 top-16 z-50">
                  <FocusTrap
                    active={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                  >
                    <div
                      ref={mobilePanelRef}
                      tabIndex={-1}
                      className="bg-[#F5F3E7] text-[#3E5E4D] rounded-lg shadow-lg p-4 border border-[#A8BDA5]/40"
                      style={{
                        maxHeight: "calc(100vh - 4rem)",
                        overflowY: "auto",
                      }}
                      role="dialog"
                      aria-modal="true"
                      aria-label="Mobile navigation"
                    >
                      <nav
                        className="flex flex-col gap-1"
                        aria-label="Mobile primary"
                      >
                        {pagesBase
                          .filter(
                            ({ label }) =>
                              label !== "Add Author" ||
                              effectiveRole === "ADMIN"
                          )
                          .map(({ label, path }) => {
                            const isActive = pathname === path;
                            return (
                              <Link
                                key={label}
                                href={path}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-md text-sm font-medium hover:bg-[#E6B89C]/20 ${
                                  isActive ? "font-semibold" : ""
                                }`}
                                aria-current={isActive ? "page" : undefined}
                              >
                                {label}
                              </Link>
                            );
                          })}
                      </nav>

                      <div className="mt-3 border-t border-[#A8BDA5]/30 pt-3">
                        {user?.login ? (
                          <>
                            {settings.map(({ label, path, type }) =>
                              type === "link" ? (
                                <button
                                  key={label}
                                  onClick={() => {
                                    router.push(path);
                                    setMobileOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#E6B89C]/20"
                                >
                                  {label}
                                </button>
                              ) : (
                                <button
                                  key={label}
                                  onClick={() => {
                                    if (label === "Logout") handleLogout();
                                    setMobileOpen(false);
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#E6B89C]/20"
                                >
                                  {label}
                                </button>
                              )
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`${APIROUTE.login}`}
                              onClick={() => setMobileOpen(false)}
                              className="px-3 py-2 text-sm hover:underline"
                            >
                              Login
                            </Link>
                            <Link
                              href={`${APIROUTE.signup}`}
                              onClick={() => setMobileOpen(false)}
                              className="px-3 py-2 bg-[#A8BDA5] text-white rounded-full text-center font-semibold hover:bg-[#8FA98B]"
                            >
                              Sign Up
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </FocusTrap>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
