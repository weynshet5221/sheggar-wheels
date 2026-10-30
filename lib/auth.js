import { STORAGE_KEYS } from "./constants";
import {
  readStorage,
  readSession,
  writeStorage,
  writeSession,
  removeSession,
} from "./storage";

export { writeSession, removeSession };

const DEMO_ACCOUNTS = [
  { id: "usr-admin-1", username: "admin", password: "Admin@123", role: "admin" },
  { id: "usr-owner-1", username: "owner", password: "Owner@123", role: "owner" },
  { id: "usr-renter-1", username: "renter", password: "Renter@123", role: "renter" },
];

function normalizeUsername(username) {
  return String(username || "").trim().toLowerCase();
}

function toBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function derivePasswordHash(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password hashing is unavailable in this browser.");
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 120000, hash: "SHA-256" },
    key,
    256
  );
  return toBase64(bits);
}

export async function createPasswordCredentials(password) {
  const salt = crypto.randomUUID();
  return { passwordSalt: salt, passwordHash: await derivePasswordHash(password, salt) };
}

export async function ensureDemoAccounts() {
  const users = readStorage(STORAGE_KEYS.USERS, []);
  if (!Array.isArray(users)) return;

  let changed = false;
  for (const account of DEMO_ACCOUNTS) {
    const user = users.find((item) => item.id === account.id);
    if (!user) continue;

    if (!user.username) {
      user.username = account.username;
      changed = true;
    }
    if (!user.passwordHash || !user.passwordSalt) {
      Object.assign(user, await createPasswordCredentials(account.password));
      changed = true;
    }
  }
  if (changed) {
    const normalizedUsers = users.map((user) => {
      const demo = DEMO_ACCOUNTS.find((account) => account.id === user.id);
      if (!demo) return user;
      return { ...user, roles: Array.isArray(user.roles) ? user.roles : [demo.role] };
    });
    writeStorage(STORAGE_KEYS.USERS, normalizedUsers);
  }
}

export function getCurrentSession() {
  const sessionData = readSession(STORAGE_KEYS.SESSION, null);
  if (!sessionData?.userId) return null;

  const users = readStorage(STORAGE_KEYS.USERS, []);
  if (!Array.isArray(users)) return null;

  const user = users.find((item) => item.id === sessionData.userId);
  if (!user || user.status === "suspended") return null;

  const activeRole = sessionData.activeRole;
  if (!Array.isArray(user.roles) || !user.roles.includes(activeRole)) return null;

  return { ...user, activeRole, sessionId: sessionData.sessionId };
}

export async function signInWithCredentials({ username, password, role }) {
  const users = readStorage(STORAGE_KEYS.USERS, []);
  if (!Array.isArray(users)) {
    return { success: false, error: "Demo account data is unavailable. Refresh the page." };
  }

  const normalizedUsername = normalizeUsername(username);
  const user = users.find((item) => normalizeUsername(item.username) === normalizedUsername);

  if (!user) return { success: false, error: "Incorrect username or password." };
  if (user.status === "suspended") return { success: false, error: "This account is suspended." };
  if (!Array.isArray(user.roles) || !user.roles.includes(role)) {
    return { success: false, error: "This account does not have that role." };
  }
  if (!user.passwordSalt || !user.passwordHash) {
    return { success: false, error: "Account credentials are not initialized. Refresh and try again." };
  }

  const enteredHash = await derivePasswordHash(password, user.passwordSalt);
  if (enteredHash !== user.passwordHash) {
    return { success: false, error: "Incorrect username or password." };
  }

  writeSession(STORAGE_KEYS.SESSION, {
    userId: user.id,
    activeRole: role,
    sessionId: crypto.randomUUID(),
    signedInAt: new Date().toISOString(),
  });

  return { success: true, user: { ...user, activeRole: role } };
}

export function signOut() {
  removeSession(STORAGE_KEYS.SESSION);
  removeSession(STORAGE_KEYS.CHECKOUT_DRAFT);
}

export function hasRole(user, role) {
  if (!user) return false;
  if (user.activeRole) return user.activeRole === role;
  return Array.isArray(user.roles) && user.roles.includes(role);
}

export function safeReturnPath(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\") || value.includes("\\")) {
    return "/";
  }

  let pathname;
  try {
    pathname = new URL(value, "https://sheggar-wheels.invalid").pathname;
  } catch {
    return "/";
  }

  if (pathname === "/signin" || pathname === "/signup") return "/";
  return value;
}
