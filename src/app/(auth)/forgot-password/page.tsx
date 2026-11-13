'use client';

import { useActionState } from 'react';
import { forgotPassword, type AuthState } from '@/lib/actions/auth';
import {
  errorAlertClass,
  inputClass,
  labelClass,
  linkClass,
  primaryButtonClass,
  successAlertClass,
} from '@/components/ui/form-styles';

const initialState: AuthState = {};

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, initialState);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Forgot password</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">Enter your email and we&apos;ll send you a reset link.</p>
      {state.error && (
        <div role="alert" className={errorAlertClass}>
          {state.error}
        </div>
      )}
      {state.message && (
        <div role="status" className={successAlertClass}>
          {state.message}
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
            className={inputClass}
          />
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        <a href="/login" className={linkClass}>
          Back to sign in
        </a>
      </p>
    </>
  );
}
