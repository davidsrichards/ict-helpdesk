'use client';

import { useActionState } from 'react';
import { login, type AuthState } from '@/lib/actions/auth';
import {
  errorAlertClass,
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from '@/components/ui/form-styles';

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">Sign in to log and track your ICT support requests.</p>
      {state.error && (
        <div role="alert" className={errorAlertClass}>
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={320}
            autoComplete="email"
            placeholder="you@nsuk.edu.ng"
            className={inputClass}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <a href="/forgot-password" className={`text-sm ${linkClass}`}>
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <a href="/signup" className={linkClass}>
          Sign up
        </a>
      </p>
    </>
  );
}
