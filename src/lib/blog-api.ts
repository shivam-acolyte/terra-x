export type BlogStatus = "draft" | "published";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  mobile_image_url?: string | null;
  post_date: string | null;
  read_time: string | null;
  image_alt_text: string | null;
  image_title: string | null;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  author_name: string;
  author_role?: string | null;
  author_bio?: string | null;
  author_avatar_url?: string | null;
  author_social_url?: string | null;
  category: string;
  status: BlogStatus;
  tags?: string[];
  og_image_url?: string | null;
  meta_keywords?: string | null;
  no_index?: boolean;
  head_scripts?: string | null;
  body_scripts?: string | null;
  schema_markup?: string | null;
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
  mobile_image_url?: string;
  post_date: string;
  read_time: string;
  image_alt_text: string;
  image_title: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  author_name: string;
  author_role?: string;
  author_bio?: string;
  author_avatar_url?: string;
  author_social_url?: string;
  category: string;
  status: BlogStatus;
  tags?: string[];
  og_image_url?: string;
  meta_keywords?: string;
  no_index?: boolean;
  head_scripts?: string;
  body_scripts?: string;
  schema_markup?: string;
};

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};

type AuthSession = {
  access_token: string;
  user?: { email?: string };
};

const SESSION_KEY = "terra-x-blog-admin-session";

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || `Request failed (${response.status}).`);
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isBlogApiAvailable() {
  return true;
}

export function getStoredSession(): AuthSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function signInAdmin(email: string, password: string) {
  const session = await request<AuthSession>("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signOutAdmin() {
  clearStoredSession();
}

export async function fetchPublishedPosts() {
  return request<BlogPost[]>("/api/blog-posts");
}

export async function fetchPublishedPostBySlug(slug: string, token?: string) {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  return request<BlogPost | null>(`/api/blog-posts/${encodeURIComponent(slug)}`, {
    headers,
  });
}

export async function fetchAllPosts(token: string) {
  return request<BlogPost[]>("/api/admin/blog-posts", {
    headers: authHeaders(token),
  });
}

export async function upsertPost(values: BlogFormValues, token: string, id?: string) {
  return request<BlogPost>(id ? `/api/admin/blog-posts/${id}` : "/api/admin/blog-posts", {
    method: id ? "PATCH" : "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      ...values,
      slug: createSlug(values.slug || values.title),
    }),
  });
}

export async function deletePost(id: string, token: string) {
  return request<void>(`/api/admin/blog-posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function duplicatePost(id: string, token: string) {
  return request<BlogPost>(`/api/admin/blog-posts/${id}/duplicate`, {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function uploadBlogImage(file: File, token: string) {
  const body = new FormData();
  body.append("image", file);
  const result = await request<{ url: string }>("/api/admin/uploads/blog-images", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  return result.url;
}

export async function fetchAdminUsers(token: string) {
  return request<AdminUser[]>("/api/admin/users", {
    headers: authHeaders(token),
  });
}

export async function createAdminUser(data: { email: string; password: string }, token: string) {
  return request<AdminUser>("/api/admin/users", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function updateAdminUserPassword(id: string, password: string, token: string) {
  return request<AdminUser>(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ password }),
  });
}

export async function deleteAdminUser(id: string, token: string) {
  return request<void>(`/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function parseBlogPdf(file: File, token: string) {
  const body = new FormData();
  body.append("pdf", file);
  return request<Partial<BlogFormValues>>("/api/admin/parse-pdf", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
}
