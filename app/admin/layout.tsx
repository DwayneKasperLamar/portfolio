import Link from 'next/link';
import { logout } from './login/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10 font-sans">
      <div className="flex justify-between items-center mb-8">
        <nav className="flex gap-4 text-sm">
          <Link href="/admin/profile" className="text-muted hover:text-primary">
            Profile
          </Link>
          <Link href="/admin/projects" className="text-muted hover:text-primary">
            Projects
          </Link>
          <Link href="/admin/tech" className="text-muted hover:text-primary">
            Tech items
          </Link>
          <Link href="/admin/env" className="text-muted hover:text-primary">
            Env
          </Link>
        </nav>
        <form action={logout}>
          <button className="text-sm text-muted hover:text-primary">Log out</button>
        </form>
      </div>
      {children}
    </div>
  );
}
