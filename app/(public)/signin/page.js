"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initializeDemoData } from "@/lib/storage";
import {
  ensureDemoAccounts,
  signInWithCredentials,
  safeReturnPath,
} from "@/lib/auth";

const ROLE_DASHBOARDS = {
  renter: "/renter/dashboard",
  owner: "/owner/dashboard",
  admin: "/admin/dashboard",
};

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("renter");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepareAccounts() {
      try {
        initializeDemoData();
        await ensureDemoAccounts();
        setReady(true);
      } catch {
        setError("Could not initialize demo accounts. Refresh the page and try again.");
      }
    }
    prepareAccounts();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithCredentials({ username, password, role });
      if (!result.success) {
        setError(result.error || "Sign-in failed. Check your details and try again.");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const requestedPath = params.get("next");
      const destination = requestedPath
        ? safeReturnPath(requestedPath)
        : ROLE_DASHBOARDS[role];

      window.location.replace(destination);
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto my-12 max-w-md rounded-2xl border border-[#e2e8e4] bg-white p-8 shadow-sm">
      <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.16em] text-[#55715e]">Sheggar Wheels · Demo</p>
      <h1 className="mb-2 text-center text-2xl font-bold text-[#1a2e22]">Sign In</h1>
      <p className="mb-6 text-center text-sm text-gray-500">Sign in to manage your rentals or vehicle listings.</p>

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-semibold">Sign in as</label>
          <select id="role" value={role} onChange={(event) => setRole(event.target.value)} className="min-h-11 w-full rounded-xl border p-3 text-sm">
            <option value="renter">Renter</option>
            <option value="owner">Car Owner</option>
            <option value="admin">Admin demo account</option>
          </select>
        </div>
        <div>
          <label htmlFor="username" className="mb-1 block text-sm font-semibold">Username</label>
          <input id="username" autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="min-h-11 w-full rounded-xl border p-3 text-sm" placeholder="Enter your username" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-11 w-full rounded-xl border p-3 text-sm" placeholder="Enter your password" />
        </div>
        <button type="submit" disabled={!ready || loading} className="min-h-12 w-full rounded-xl bg-[#1a2e22] py-3 font-bold text-white hover:bg-[#2d4a3e] disabled:opacity-60">
          {!ready ? "Preparing demo accounts…" : loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <section className="mt-6 border-t pt-5">
        <h2 className="mb-2 text-sm font-bold">Demo credentials</h2>
        <div className="space-y-1 text-sm text-gray-600">
          <p><strong>Renter:</strong> renter / Renter@123</p>
          <p><strong>Owner:</strong> owner / Owner@123</p>
          <p><strong>Admin:</strong> admin / Admin@123</p>
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-[#1a2e22] underline">Sign up</Link>
      </p>
    </main>
  );
}
