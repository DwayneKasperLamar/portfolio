'use server';

import { revalidatePath } from 'next/cache';
import { getSupabase } from '@/lib/supabase';

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

export async function updateProfile(formData: FormData) {
  await getSupabase()
    .from('profile')
    .update({
      name: str(formData, 'name'),
      location: str(formData, 'location'),
      role_title: str(formData, 'role_title'),
      current_role_text: str(formData, 'current_role_text'),
      previous_role_text: str(formData, 'previous_role_text'),
      now_text: str(formData, 'now_text'),
      email: str(formData, 'email'),
      github_url: str(formData, 'github_url'),
      twitter_url: str(formData, 'twitter_url'),
    })
    .eq('id', 1);

  revalidatePath('/');
  revalidatePath('/admin/profile');
}

export async function upsertProject(formData: FormData) {
  await getSupabase().from('projects').upsert({
    slug: str(formData, 'slug'),
    title: str(formData, 'title'),
    description: str(formData, 'description'),
    href: str(formData, 'href'),
    logo_url: str(formData, 'logo_url') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
  });

  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function deleteProject(formData: FormData) {
  await getSupabase().from('projects').delete().eq('slug', str(formData, 'slug'));
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function upsertTechItem(formData: FormData) {
  const id = str(formData, 'id');
  const row = {
    label: str(formData, 'label'),
    icon_key: str(formData, 'icon_key'),
    category: str(formData, 'category'),
    project_slug: str(formData, 'project_slug') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
  };

  if (id) {
    await getSupabase().from('tech_items').update(row).eq('id', id);
  } else {
    await getSupabase().from('tech_items').insert(row);
  }

  revalidatePath('/');
  revalidatePath('/admin/tech');
}

export async function deleteTechItem(formData: FormData) {
  await getSupabase().from('tech_items').delete().eq('id', str(formData, 'id'));
  revalidatePath('/');
  revalidatePath('/admin/tech');
}
