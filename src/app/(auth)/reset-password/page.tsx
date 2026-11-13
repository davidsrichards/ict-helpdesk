'use client';

import { useActionState } from 'react';
import { resetPassword, type AuthState } from '@/lib/actions/auth';
import {
  errorAlertClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from '@/components/ui/form-styles';

const initialState: AuthState = {};

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, initialState);

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">Choose a new password for your account.</p>
      {state.error && (
        <div role="alert" className={errorAlertClass}>
          {state.error}
        </div>
      )}
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="password" className={labelClass}>
            New password
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
            Confirm new password
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
          {pending ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </>
  );
}
