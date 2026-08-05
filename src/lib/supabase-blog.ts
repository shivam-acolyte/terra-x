export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  post_date: string | null;
  read_time: string | null;
  image_alt_text: string | null;
  image_title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  author_name: string;
  category: string;
  status: BlogStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  post_date: string;
  read_time: string;
  image_alt_text: string;
  image_title: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  author_name: string;
  category: string;
  status: BlogStatus;
};

type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user?: {
    email?: string;
  };
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SESSION_KEY = "terra-x-blog-admin-session";

function requireSupabaseConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Supabase env missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.",
    );
  }

  return {
    url: SUPABASE_URL.replace(/\/+$/, ""),
    anonKey: SUPABASE_ANON_KEY,
  };
}

function headers(token?: string) {
  const { anonKey } = requireSupabaseConfig();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${token || anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Supabase request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getStoredSession(): AuthSession | null {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function signInAdmin(email: string, password: string) {
  const { url, anonKey } = requireSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const session = await parseResponse<AuthSession>(response);
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signUpAdmin(email: string, password: string) {
  const { url, anonKey } = requireSupabaseConfig();
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const session = await parseResponse<AuthSession>(response);

  if (session.access_token) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export async function signOutAdmin(token: string) {
  const { url, anonKey } = requireSupabaseConfig();
  await fetch(`${url}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });
  clearStoredSession();
}

export async function fetchPublishedPosts() {
  const { url } = requireSupabaseConfig();
  const params = new URLSearchParams({
    select: "*",
    status: "eq.published",
    order: "published_at.desc.nullslast",
  });

  const response = await fetch(`${url}/rest/v1/blog_posts?${params}`, {
    headers: headers(),
  });
  return parseResponse<BlogPost[]>(response);
}

export async function fetchPublishedPostBySlug(slug: string) {
  const { url } = requireSupabaseConfig();
  const params = new URLSearchParams({
    select: "*",
    slug: `eq.${slug}`,
    status: "eq.published",
    limit: "1",
  });

  const response = await fetch(`${url}/rest/v1/blog_posts?${params}`, {
    headers: headers(),
  });
  const posts = await parseResponse<BlogPost[]>(response);
  return posts[0] || null;
}

export async function fetchAllPosts(token: string) {
  const { url } = requireSupabaseConfig();
  const params = new URLSearchParams({
    select: "*",
    order: "updated_at.desc",
  });

  const response = await fetch(`${url}/rest/v1/blog_posts?${params}`, {
    headers: headers(token),
  });
  return parseResponse<BlogPost[]>(response);
}

export async function upsertPost(values: BlogFormValues, token: string, id?: string) {
  const { url } = requireSupabaseConfig();
  const slug = createSlug(values.slug || values.title);
  const body = {
    ...values,
    slug,
    cover_image_url: values.cover_image_url || null,
    post_date: values.post_date || new Date().toISOString().slice(0, 10),
    read_time: values.read_time || null,
    image_alt_text: values.image_alt_text || null,
    image_title: values.image_title || null,
    meta_title: values.meta_title || null,
    meta_description: values.meta_description || null,
    canonical_url: values.canonical_url || null,
    published_at: values.status === "published" ? new Date().toISOString() : null,
  };

  const endpoint = id
    ? `${url}/rest/v1/blog_posts?id=eq.${id}`
    : `${url}/rest/v1/blog_posts`;
  const response = await fetch(endpoint, {
    method: id ? "PATCH" : "POST",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  const posts = await parseResponse<BlogPost[]>(response);
  return posts[0];
}

export async function deletePost(id: string, token: string) {
  const { url } = requireSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/blog_posts?id=eq.${id}`, {
    method: "DELETE",
    headers: headers(token),
  });
  return parseResponse<BlogPost[]>(response);
}

export async function uploadBlogImage(file: File, token: string) {
  const { url, anonKey } = requireSupabaseConfig();
  const extension = file.name.split(".").pop() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const response = await fetch(`${url}/storage/v1/object/blog-images/${safeName}`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });

  await parseResponse(response);
  return `${url}/storage/v1/object/public/blog-images/${safeName}`;
}
