import { getSupabase } from '@/lib/supabase';

export interface Profile {
  id: number;
  name: string;
  location: string;
  role_title: string;
  current_role_text: string;
  previous_role_text: string;
  now_text: string;
  email: string;
  github_url: string;
  twitter_url: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  href: string;
  logo_url: string | null;
  sort_order: number;
}

export type TechCategory = 'stack' | 'skill';

export interface TechItem {
  id: string;
  label: string;
  icon_key: string;
  category: TechCategory;
  project_slug: string | null;
  sort_order: number;
}

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await getSupabase().from('profile').select('*').eq('id', 1).single();
  if (error) return null;
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await getSupabase().from('projects').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}

export async function getTechItems(): Promise<TechItem[]> {
  const { data, error } = await getSupabase().from('tech_items').select('*').order('sort_order', { ascending: true });
  if (error) return [];
  return data;
}
