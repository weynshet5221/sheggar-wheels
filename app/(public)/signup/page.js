
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { readStorage, writeStorage, initializeDemoData } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import {
  createPasswordCredentials,
  ensureDemoAccounts,
} from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('renter');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event) {
    event.preventDefault();
    setError('');

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
      setError('Username must be 3–20 characters and use only letters, numbers, or underscores.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      initializeDemoData();
      await ensureDemoAccounts();

      const users = readStorage(STORAGE_KEYS.USERS, []);

      if (users.some((user) => user.username?.toLowerCase() === normalizedUsername)) {
        setError('That username is already taken.');
        return;
      }

      if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
        setError('An account with that email already exists.');
        return;
      }

      const credentials = await createPasswordCredentials(password);

      const newUser = {
        id: `usr-${crypto.randomUUID()}`,
        name: name.trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        phone: phone.trim(),
        roles: [role],
        status: 'active',
        ...credentials,
        createdAt: new Date().toISOString(),
      };

      writeStorage(STORAGE_KEYS.USERS, [...users, newUser]);

      router.push('/signin?registered=1');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto my-12 p-8 bg-white rounded-2xl border border-[#e2e8e4] shadow-sm">
      <h1 className="text-2xl font-bold mb-2 text-[#1a2e22]">
        Create an Account
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Register as a renter or a car owner.
      </p>

      {error && (
        <p role="alert" className="p-3 mb-4 text-sm bg-red-50 text-red-700 rounded-lg">
          {error}
        </p>
      )}

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="role" className="block text-sm font-semibold mb-1">
            Account type
          </label>
          <select
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
          >
            <option value="renter">Renter</option>
            <option value="owner">Car Owner</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-1">
            Full name
          </label>
          <input
            id="name"
            required
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-semibold mb-1">
            Username
          </label>
          <input
            id="username"
            required
            autoComplete="username"
            minLength={3}
            maxLength={20}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
            placeholder="Letters, numbers, underscores"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-1">
            Email address
          </label>
          <input
            id="email"
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold mb-1">
            Phone number
          </label>
          <input
            id="phone"
            required
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            required
            type="password"
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            required
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full border rounded-xl p-3 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a2e22] text-white py-3 rounded-xl font-bold hover:bg-[#2d4a3e] disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <Link href="/signin" className="font-semibold text-[#1a2e22] underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
