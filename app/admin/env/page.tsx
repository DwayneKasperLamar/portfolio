export const dynamic = 'force-dynamic';

const TRACKED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_PASSWORD',
  'ADMIN_SESSION_SECRET',
] as const;

export default function AdminEnvPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-primary mb-2">Environment variables</h1>
      <p className="text-sm text-muted mb-6">
        Read-only. Values are never shown &mdash; edit them in <code>.env.local</code> (local) or your Vercel
        project settings (production).
      </p>
      <ul className="flex flex-col gap-2">
        {TRACKED_ENV_VARS.map((key) => {
          const isSet = Boolean(process.env[key]);
          return (
            <li key={key} className="flex items-center justify-between border border-line rounded px-3 py-2">
              <span className="font-mono text-sm text-secondary">{key}</span>
              <span className={`font-mono text-xs ${isSet ? 'text-green-500' : 'text-red-500'}`}>
                {isSet ? '•••• set' : 'not set'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
