import { login } from './actions';

import { safeNextPath } from '@/lib/auth';

export default function LoginPage({ searchParams }: { searchParams: { error?: string; next?: string } }) {
  return (
    <main className="max-w-sm mx-auto px-6 pt-32">
      <h1 className="text-lg font-semibold text-primary mb-6">Owner login</h1>
      <form action={login} className="flex flex-col gap-3">
        <input type="hidden" name="next" value={safeNextPath(searchParams.next)} />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="bg-surface-alt border border-line rounded px-3 py-2 text-primary placeholder:text-muted focus:outline-none"
        />
        <button type="submit" className="bg-surface-alt border border-line rounded px-3 py-2 text-primary hover:border-muted transition-colors">
          Log in
        </button>
        {searchParams.error && <p className="text-sm text-red-500">Wrong password.</p>}
      </form>
    </main>
  );
}
