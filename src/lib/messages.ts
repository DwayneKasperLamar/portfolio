import { getSupabase } from '@/lib/supabase';

export const MESSAGE_LIMITS = { name: 100, email: 200, body: 3000, perSenderPerHour: 3, everyonePerDay: 50 } as const;

export interface Message {
  id: string;
  name: string;
  email: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

/** False until supabase/004_messages.sql has been run: the form stays hidden instead of failing. */
export async function messagesReady(): Promise<boolean> {
  const { error } = await getSupabase().from('messages').select('id').limit(1);
  return !error;
}

/** Owner only (admin). */
export async function getOwnerMessages(): Promise<Message[]> {
  const { data, error } = await getSupabase()
    .from('messages')
    .select('id,name,email,body,is_read,created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  return error || !data ? [] : data;
}

export const alertsConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.ALERT_EMAIL);

// Email the owner. Best effort: what happened is already saved, so a slow or failing email
// service must never turn a successful action into an error.
export async function sendOwnerAlert(subject: string, text: string, replyTo?: string): Promise<void> {
  if (!alertsConfigured()) return;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Portfolio <onboarding@resend.dev>', // only delivers to the Resend account's own address
        to: [process.env.ALERT_EMAIL],
        ...(replyTo ? { reply_to: replyTo } : {}),
        subject: subject.replace(/\s+/g, ' ').slice(0, 200),
        text,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error(`Alert not sent: email service answered ${response.status}`);
  } catch {
    console.error('Alert not sent: email service unreachable');
  }
}

export const sendAlert = (message: { name: string; email: string; body: string }) =>
  sendOwnerAlert(
    `New message from ${message.name}`,
    `${message.name} <${message.email}> wrote:\n\n${message.body}\n\nAll messages: /admin/enquiries`,
    message.email,
  );
