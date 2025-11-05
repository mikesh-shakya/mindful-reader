const STORAGE_KEY = "mindful_user";

/* -----------------------------
   🌿 Helpers
----------------------------- */

const isBrowser = () => typeof window !== "undefined";

const safeJSONParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

/* -----------------------------
   🌿 Core Auth API
----------------------------- */

/**
 * Checks if a user is logged in.
 */
export const isLoggedIn = () => {
  if (!isBrowser()) return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  return !!raw;
};

/**
 * Store user data and trigger change.
 */
export const doLogin = (data, next) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}));
    _emitAuthChange(data || null);
  } catch (e) {
    if (process.env.NODE_ENV === "development")
      console.error("doLogin storage error:", e);
  } finally {
    if (typeof next === "function") next();
  }
};

/**
 * Clear user and notify listeners.
 */
export const doLogout = (next) => {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    _emitAuthChange(null);
  } catch (e) {
    if (process.env.NODE_ENV === "development")
      console.error("doLogout storage error:", e);
  } finally {
    if (typeof next === "function") next();
  }
};

/**
 * Returns the current user object.
 */
export const getCurrentUser = () => {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? safeJSONParse(raw) : null;
};

/**
 * Get user role.
 */
export const getCurrentUserRole = () => {
  const u = getCurrentUser();
  return u?.role || null;
};

/**
 * Get user ID.
 */
export const getCurrentUserId = () => {
  const u = getCurrentUser();
  return u?.userId || u?.id || null;
};

/**
 * Get JWT token.
 */
export const getToken = () => {
  const u = getCurrentUser();
  return u?.token || null;
};

/**
 * Detect if JWT is expired (basic).
 */
export const isTokenExpired = () => {
  try {
    const token = getToken();
    if (!token) return true;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload?.exp;
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

/* -----------------------------
   🌿 Reactive Auth Listeners
----------------------------- */

let _authListeners = [];

export function onAuthChange(cb) {
  if (typeof cb !== "function") return () => {};
  _authListeners.push(cb);
  return () => {
    _authListeners = _authListeners.filter((c) => c !== cb);
  };
}

export function _emitAuthChange(nextUser) {
  _authListeners.forEach((cb) => {
    try {
      cb(nextUser);
    } catch (e) {
      if (process.env.NODE_ENV === "development")
        console.error("auth listener error:", e);
    }
  });
}

/* -----------------------------
   🌿 Cross-tab Sync
----------------------------- */

if (isBrowser()) {
  window.addEventListener("storage", (ev) => {
    if (ev.key === STORAGE_KEY) {
      const newVal = ev.newValue ? safeJSONParse(ev.newValue) : null;
      _emitAuthChange(newVal);
    }
  });
}

/* -----------------------------
   🌿 Export API
----------------------------- */

export default {
  isLoggedIn,
  doLogin,
  doLogout,
  getCurrentUser,
  getCurrentUserRole,
  getCurrentUserId,
  getToken,
  isTokenExpired,
  onAuthChange,
};
