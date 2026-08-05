import {
  BlogFormValues,
  BlogPost,
  BlogStatus,
  clearStoredSession,
  createSlug,
  deletePost,
  fetchAllPosts,
  fetchPublishedPostBySlug,
  fetchPublishedPosts,
  getStoredSession,
  isSupabaseConfigured,
  signInAdmin,
  signOutAdmin,
  signUpAdmin,
  uploadBlogImage,
  upsertPost,
} from "@/lib/supabase-blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Bold,
  CalendarDays,
  Edit3,
  Eye,
  FileText,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  LogOut,
  Plus,
  Quote,
  Redo2,
  Save,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const emptyForm: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  post_date: new Date().toISOString().slice(0, 10),
  read_time: "5 min read",
  image_alt_text: "",
  image_title: "",
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  author_name: "TERRA-X Team",
  category: "Technology",
  status: "draft",
};
const ADMIN_EMAIL = "terrax@gmail.com";
const ADMIN_PASSWORD_HINT = "Admin123@@";

function formatDate(value?: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function postDisplayDate(post: BlogPost) {
  return formatDate(post.post_date || post.published_at);
}

function ConfigMissing() {
  return (
    <div className="rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm text-muted-foreground">
      Supabase connect karne ke liye `.env` me `VITE_SUPABASE_URL` aur
      `VITE_SUPABASE_ANON_KEY` add karein. SQL setup file `supabase-blog-schema.sql` me diya hai.
    </div>
  );
}

function BlogBody({ content }: { content: string }) {
  return (
    <div className="space-y-5 text-base leading-8 text-foreground/85">
      {content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, index) => {
          if (block.startsWith("## ")) {
            return (
              <h2 key={index} className="pt-5 text-2xl font-black text-foreground">
                {block.replace(/^##\s+/, "")}
              </h2>
            );
          }

          if (block.startsWith("- ")) {
            return (
              <ul key={index} className="space-y-2 pl-5">
                {block.split("\n").map((item) => (
                  <li key={item} className="list-disc">
                    {item.replace(/^-\s+/, "")}
                  </li>
                ))}
              </ul>
            );
          }

          return <p key={index}>{block}</p>;
        })}
    </div>
  );
}

function BlogHero() {
  return (
    <section className="relative overflow-hidden border-b border-border pt-32">
      <div className="absolute inset-0 -z-10 bg-grid opacity-50" />
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-electric">
            <span className="h-px w-8 bg-electric" /> Terra-X Blog
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Ideas on <span className="gradient-text">autonomous heavy machinery</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Company updates, field notes, product thinking, robotics insights, and market education
            for TERRA-X customers and partners.
          </p>
        </div>
      </div>
    </section>
  );
}

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    fetchPublishedPosts()
      .then(setPosts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <BlogHero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {!isSupabaseConfigured() && <ConfigMissing />}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading blogs
          </div>
        )}
        {error && <div className="rounded-xl border border-destructive/40 p-5 text-sm">{error}</div>}
        {!loading && posts.length === 0 && isSupabaseConfigured() && (
          <div className="rounded-xl border border-border bg-card/50 p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-electric" />
            <h2 className="mt-4 text-xl font-bold">No published blogs yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Admin panel se blog publish karte hi yahan show ho jayega.
            </p>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:border-electric hover:shadow-glow"
            >
              {post.cover_image_url ? (
                <img
                  src={post.cover_image_url}
                  alt={post.image_alt_text || post.title}
                  title={post.image_title || post.title}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[16/10] place-items-center bg-gradient-gold text-primary-foreground">
                  <FileText className="h-12 w-12" />
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  <span className="text-electric">{post.category}</span>
                  <span>{postDisplayDate(post)}</span>
                  {post.read_time && <span>{post.read_time}</span>}
                </div>
                <h2 className="mt-3 text-xl font-black leading-tight group-hover:text-electric">
                  {post.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-electric">
                  Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export function BlogSinglePage({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    fetchPublishedPostBySlug(slug)
      .then(setPost)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <article className="pt-24">
      <section className="border-b border-border bg-card/20">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          {!isSupabaseConfigured() && <ConfigMissing />}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading blog
            </div>
          )}
          {error && <div className="rounded-xl border border-destructive/40 p-5 text-sm">{error}</div>}
          {!loading && !post && isSupabaseConfigured() && (
            <div className="rounded-xl border border-border bg-background p-8 text-center">
              <h1 className="text-3xl font-black">Blog not found</h1>
              <a href="/blog" className="mt-4 inline-flex text-sm font-semibold text-electric">
                Back to blogs
              </a>
            </div>
          )}
          {post && (
            <>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                <span className="text-electric">{post.category}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" /> {postDisplayDate(post)}
                </span>
                {post.read_time && <span>{post.read_time}</span>}
                <span>{post.author_name}</span>
              </div>
              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{post.title}</h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.excerpt}</p>
            </>
          )}
        </div>
      </section>
      {post && (
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.image_alt_text || post.title}
              title={post.image_title || post.title}
              className="mb-10 aspect-[16/9] w-full rounded-xl border border-border object-cover"
            />
          )}
          <BlogBody content={post.content} />
        </section>
      )}
    </article>
  );
}

function LoginPanel({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function friendlyError(err: unknown) {
    const message = err instanceof Error ? err.message : "Request failed";

    if (message.includes("invalid_credentials")) {
      return "Login failed: Supabase Auth me ye email/password user nahi mila. Pehle Create Admin Account dabayein ya Supabase dashboard me user banayein.";
    }

    if (message.includes("User already registered")) {
      return "Ye admin email already bana hua hai. Ab Login button se sign in karein.";
    }

    if (message.includes("email_not_confirmed") || message.includes("Email not confirmed")) {
      return "Admin account bana hua hai, bas email confirm pending hai. Supabase SQL Editor me supabase-confirm-admin.sql run kar do, phir login ho jayega.";
    }

    return message;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const session = await signInAdmin(email, password);
      onLogin(session.access_token);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAdmin() {
    setCreating(true);
    setError("");
    setNotice("");

    try {
      const session = await signUpAdmin(email, password);
      if (session.access_token) {
        onLogin(session.access_token);
        return;
      }

      setNotice(
        "Admin account create request chali gayi. Agar login na ho, Supabase dashboard me email confirmation disable/confirm karke Login karein.",
      );
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setCreating(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 shadow-soft"
    >
      <h1 className="text-2xl font-black">Blog Admin Login</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Admin ID: {ADMIN_EMAIL} / Password: {ADMIN_PASSWORD_HINT}
      </p>
      <div className="mt-6 space-y-4">
        <Input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Login
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={creating || !email || !password}
          onClick={handleCreateAdmin}
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create Admin Account
        </Button>
      </div>
    </form>
  );
}

function PostForm({
  selectedPost,
  token,
  onSaved,
  onCancel,
}: {
  selectedPost: BlogPost | null;
  token: string;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<BlogFormValues>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedPost) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: selectedPost.title,
      slug: selectedPost.slug,
      excerpt: selectedPost.excerpt,
      content: selectedPost.content,
      cover_image_url: selectedPost.cover_image_url || "",
      post_date: selectedPost.post_date || new Date().toISOString().slice(0, 10),
      read_time: selectedPost.read_time || "5 min read",
      image_alt_text: selectedPost.image_alt_text || "",
      image_title: selectedPost.image_title || "",
      meta_title: selectedPost.meta_title || selectedPost.title,
      meta_description: selectedPost.meta_description || selectedPost.excerpt,
      canonical_url: selectedPost.canonical_url || "",
      author_name: selectedPost.author_name,
      category: selectedPost.category,
      status: selectedPost.status,
    });
  }, [selectedPost]);

  const previewSlug = useMemo(() => createSlug(form.slug || form.title), [form.slug, form.title]);

  function setField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      await upsertPost(form, token, selectedPost?.id);
      onSaved();
      if (!selectedPost) setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Blog save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const publicUrl = await uploadBlogImage(file, token);
      setField("cover_image_url", publicUrl);
      if (!form.image_alt_text) setField("image_alt_text", file.name.replace(/\.[^.]+$/, ""));
      if (!form.image_title) setField("image_title", file.name.replace(/\.[^.]+$/, ""));
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. Supabase me blog-images storage bucket/policies add karna zaroori hai.`
          : "Image upload failed",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function insertContent(prefix: string, suffix = "") {
    setField("content", `${form.content}${form.content ? "\n" : ""}${prefix}${suffix}`);
  }

  function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
      <label className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </label>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">{selectedPost ? "Edit Blog" : "Create Blog"}</h2>
        {selectedPost && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <Plus className="h-4 w-4" /> New
          </Button>
        )}
      </div>
      <div className="mt-5 grid gap-5 border-t border-border pt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>Title</FieldLabel>
            <Input
              value={form.title}
              onChange={(event) => setField("title", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Slug</FieldLabel>
            <Input
              value={form.slug}
              onChange={(event) => setField("slug", event.target.value)}
              placeholder={previewSlug || "blog-slug"}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Date</FieldLabel>
            <Input
              type="date"
              value={form.post_date}
              onChange={(event) => setField("post_date", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Read Time</FieldLabel>
            <Input
              value={form.read_time}
              onChange={(event) => setField("read_time", event.target.value)}
              placeholder="5 min read"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Image URL</FieldLabel>
          <div className="grid gap-2 sm:grid-cols-[1fr_98px]">
            <Input
              value={form.cover_image_url}
              onChange={(event) => setField("cover_image_url", event.target.value)}
              placeholder="https://..."
            />
            <label className="inline-flex h-14 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-center text-sm font-medium text-foreground transition hover:bg-secondary">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>Image Alt Text</FieldLabel>
            <Input
              value={form.image_alt_text}
              onChange={(event) => setField("image_alt_text", event.target.value)}
              placeholder="Autonomous excavator working"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Image Title</FieldLabel>
            <Input
              value={form.image_title}
              onChange={(event) => setField("image_title", event.target.value)}
              placeholder="TERRA-X field operation"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Meta Title</FieldLabel>
          <Input
            value={form.meta_title}
            onChange={(event) => setField("meta_title", event.target.value)}
            placeholder="TERRA-X autonomous excavation guide"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Meta Description</FieldLabel>
          <Textarea
            value={form.meta_description}
            onChange={(event) => setField("meta_description", event.target.value)}
            className="min-h-[78px]"
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Canonical URL</FieldLabel>
          <Input
            value={form.canonical_url}
            onChange={(event) => setField("canonical_url", event.target.value)}
            placeholder={`https://terraxopc.com/blog/${previewSlug || "slug"}`}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel>Excerpt</FieldLabel>
          <Textarea
            value={form.excerpt}
            onChange={(event) => setField("excerpt", event.target.value)}
            className="min-h-[78px]"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel>Author</FieldLabel>
            <Input
              value={form.author_name}
              onChange={(event) => setField("author_name", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Category</FieldLabel>
            <Input
              value={form.category}
              onChange={(event) => setField("category", event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <FieldLabel>Status</FieldLabel>
            <select
              value={form.status}
              onChange={(event) => setField("status", event.target.value as BlogStatus)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel>Content</FieldLabel>
          <div className="overflow-hidden rounded-md border border-input bg-background">
            <div className="flex flex-wrap items-center gap-1 border-b border-input bg-card px-2 py-2">
              <select className="h-8 rounded-sm border border-input bg-background px-2 text-sm">
                <option>Paragraph</option>
                <option>Heading</option>
              </select>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("**Bold text**")}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("*Italic text*")}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("[Link text](https://)")}>
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("- List item")}>
                <List className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("1. List item")}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("> Quote text")}>
                <Quote className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" disabled>
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" disabled>
                <Redo2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={form.content}
              onChange={(event) => setField("content", event.target.value)}
              className="min-h-[300px] rounded-none border-0 shadow-none focus-visible:ring-0"
              required
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Blog
        </Button>
      </div>
    </form>
  );
}

export function BlogAdminPage() {
  const storedSession = typeof window !== "undefined" ? getStoredSession() : null;
  const [token, setToken] = useState(storedSession?.access_token || "");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadPosts(activeToken = token) {
    if (!activeToken || !isSupabaseConfigured()) return;
    setLoading(true);
    setError("");

    try {
      setPosts(await fetchAllPosts(activeToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts(token);
  }, [token]);

  async function handleDelete(post: BlogPost) {
    if (!window.confirm(`Delete "${post.title}"?`)) return;

    try {
      await deletePost(post.id, token);
      if (selectedPost?.id === post.id) setSelectedPost(null);
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function handleSignOut() {
    if (token) await signOutAdmin(token);
    clearStoredSession();
    setToken("");
    setPosts([]);
    setSelectedPost(null);
  }

  return (
    <div className="pt-24">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!isSupabaseConfigured() && <ConfigMissing />}
        {!token && isSupabaseConfigured() && <LoginPanel onLogin={setToken} />}
        {token && (
          <>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-electric">
                  <span className="h-px w-8 bg-electric" /> Admin
                </div>
                <h1 className="text-3xl font-black sm:text-4xl">Blog Management</h1>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <PostForm
                selectedPost={selectedPost}
                token={token}
                onSaved={() => loadPosts()}
                onCancel={() => setSelectedPost(null)}
              />

              <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <h2 className="text-xl font-black">All Blogs</h2>
                {loading && (
                  <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading
                  </p>
                )}
                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
                <div className="mt-5 space-y-3">
                  {posts.map((post) => (
                    <div key={post.id} className="rounded-lg border border-border bg-background/60 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                            <span className={post.status === "published" ? "text-electric" : ""}>
                              {post.status}
                            </span>
                            <span>{post.category}</span>
                          </div>
                          <h3 className="mt-1 truncate font-bold">{post.title}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Updated {formatDate(post.updated_at)}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-2">
                          {post.status === "published" && (
                            <a
                              href={`/blog/${post.slug}`}
                              className="grid h-9 w-9 place-items-center rounded-md border border-input"
                              aria-label="View blog"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setSelectedPost(post)}
                            aria-label="Edit blog"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(post)}
                            aria-label="Delete blog"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!loading && posts.length === 0 && (
                    <p className="rounded-lg border border-border p-5 text-sm text-muted-foreground">
                      Abhi koi blog nahi hai. Left side se first blog create karein.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
