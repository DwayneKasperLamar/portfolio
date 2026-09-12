'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, computeSessionToken } from '@/lib/auth';

export async function login(formData: FormData) {
  const password = formData.get('password');

  if (typeof password !== 'string' || password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login?error=1');
  }

  const token = await computeSessionToken();
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/admin');
}

export async function logout() {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect('/admin/login');
}
