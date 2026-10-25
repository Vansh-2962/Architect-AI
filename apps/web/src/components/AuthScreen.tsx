import { useState, type FormEvent } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { cx } from '@/lib/helpers';

type AuthMode = 'sign-in' | 'sign-up';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = mode === 'sign-up'
        ? await authClient.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await authClient.signIn.email({ email: email.trim(), password });

      if (result.error) {
        setError(result.error.message ?? 'Authentication failed. Please try again.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not reach the authentication server.');
    } finally {
      setSubmitting(false);
    }
  };

  const isSignUp = mode === 'sign-up';

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] px-4 py-10">
      <section className="w-full max-w-[420px] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 sm:p-8">
        <div className="mb-7 flex items-center gap-2">
          <Sparkles size={17} className="text-[var(--accent-primary)]" />
          <span className="text-[13px] font-bold tracking-tight text-[var(--text-primary)]">SYSTEM DESIGNER</span>
        </div>

        <h1 className="text-[22px] font-bold tracking-tight text-[var(--text-primary)]">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">
          {isSignUp ? 'Save and revisit your system designs.' : 'Sign in to continue to your designs.'}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-medium text-[var(--text-secondary)]">Name</span>
              <input
                autoComplete="name"
                className="w-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          )}
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-[var(--text-secondary)]">Email</span>
            <input
              autoComplete="email"
              className="w-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-[var(--text-secondary)]">Password</span>
            <input
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="w-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-[13px] text-[var(--text-primary)] outline-none focus:border-[var(--accent-primary)]"
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            {isSignUp && <span className="mt-1 block text-[10px] text-[var(--text-muted)]">Use at least 8 characters.</span>}
          </label>

          {error && (
            <p aria-live="polite" className="border border-[var(--error)] px-3 py-2 text-[12px] text-[var(--error)]" role="alert">
              {error}
            </p>
          )}

          <button
            className={cx(
              'flex w-full items-center justify-center gap-2 bg-[var(--accent-primary)] px-4 py-2.5 text-[13px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50',
            )}
            disabled={submitting}
            type="submit"
          >
            {submitting && <Loader2 aria-hidden="true" className="animate-spin" size={15} />}
            {isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[12px] text-[var(--text-secondary)]">
          {isSignUp ? 'Already have an account?' : 'New to System Designer?'}{' '}
          <button
            className="font-medium text-[var(--accent-primary)] hover:underline"
            onClick={() => {
              setError(null);
              setMode(isSignUp ? 'sign-in' : 'sign-up');
            }}
            type="button"
          >
            {isSignUp ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </main>
  );
}
