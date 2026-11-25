'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, computeSessionToken, safeEqual, safeNextPath } from '@/lib/auth';

export async function login(formData: FormData) {
  const password = formData.get('password');
  const next = safeNextPath(formData.get('next'));
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword || typeof password !== 'string' || !safeEqual(password, expectedPassword)) {
    redirect(`/admin/login?error=1${next !== '/admin' ? `&next=${encodeURIComponent(next)}` : ''}`);
  }

  const token = await computeSessionToken();
  if (!token) redirect('/admin/login?error=1');

  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(next);
}

export async function logout() {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
