'use client';

import { useActionState } from 'react';
import { signup, type AuthState } from '@/lib/actions/auth';
import {
  errorAlertClass,
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from '@/components/ui/form-styles';

const initialState: AuthState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  if (state.message) {
    return (
      <>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h1>
        <p className="text-sm text-gray-600">{state.message}</p>
        <div className="mt-6">
          <a href="/login" className={`text-sm ${linkClass}`}>
            Back to sign in
          </a>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">Register to submit and follow ICT support tickets.</p>
      {state.error && (
        <div role="alert" className={errorAlertClass}>
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="displayName" className={labelClass}>
            Full name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            maxLength={100}
            autoComplete="name"
            className={inputClass}
          />
        </div>
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
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-gray-500">
            At least 8 characters, 1 uppercase, 1 lowercase, and 1 digit.
          </p>
        </div>
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className={linkClass}>
          Sign in
        </a>
      </p>
    </>
  );
}
