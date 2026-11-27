import { redirect } from 'next/navigation';

// This list now lives on the Settings screen.
export default function AdminEnvPage() {
  redirect('/admin/settings');
}
