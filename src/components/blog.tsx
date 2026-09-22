import {
  AdminUser,
  BlogFormValues,
  BlogPost,
  BlogStatus,
  clearStoredSession,
  createAdminUser,
  createSlug,
  deleteAdminUser,
  deletePost,
  duplicatePost,
  fetchAdminUsers,
  fetchAllPosts,
  fetchPublishedPostBySlug,
  fetchPublishedPosts,
  getStoredSession,
  isBlogApiAvailable,
  parseBlogPdf,
  signInAdmin,
  signOutAdmin,
  updateAdminUserPassword,
  uploadBlogImage,
  upsertPost,
} from "@/lib/blog-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bold,
  CalendarDays,
  Check,
  CheckCircle2,
  Code,
  Code2,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  Globe,
  Image as ImageIcon,
  Italic,
  Key,
  Layers,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Plus,
  Quote,
  Redo2,
  Save,
  Search,
  Settings2,
  Share2,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Tag,
  Trash2,
  Undo2,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import logo from "@/assets/l2.png";
import { FormEvent, useEffect, useMemo, useState } from "react";

const emptyForm: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: "",
  mobile_image_url: "",
  post_date: new Date().toISOString().slice(0, 10),
  read_time: "5 min read",
  image_alt_text: "",
  image_title: "",
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  author_name: "TERRA-X Team",
  author_role: "",
  author_bio: "",
  author_avatar_url: "",
  author_social_url: "",
  category: "Technology",
  status: "draft",
  tags: [],
  og_image_url: "",
  meta_keywords: "",
  no_index: false,
  head_scripts: "",
  body_scripts: "",
  schema_markup: "",
};

function formatDate(value?: string | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatFullDate(value?: string | null) {
  if (!value) return "Draft";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return formatDate(value);
  }
}

function formatReadTime(value?: string | null) {
  if (!value) return "5 min read";
  if (value.toLowerCase().includes("min")) return value;
  return `${value} min read`;
}

function postDisplayDate(post: BlogPost) {
  return formatDate(post.post_date || post.published_at);
}

function ConfigMissing() {
  return (
    <div className="rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm text-muted-foreground">
      Blog service is unavailable. Confirm the PostgreSQL API is running and try again.
    </div>
  );
}

function renderBlogHtml(content: string): string {
  if (!content) return "";

  // Convert markdown links, bold, italics, quotes, headings
  let formatted = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="text-electric underline hover:text-electric/80">$1</a>'
    )
    .replace(/^### (.*$)/gim, '<h3 class="pt-4 text-xl font-bold text-foreground">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="pt-6 text-2xl font-black text-foreground">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="pt-8 text-3xl font-black text-foreground">$1</h1>')
    .replace(
      /^> (.*$)/gim,
      '<blockquote class="border-l-4 border-electric pl-4 italic text-muted-foreground my-4">$1</blockquote>'
    );

  // Split into paragraph/element blocks separated by blank lines
  const blocks = formatted.split(/\n\s*\n/);

  const processed = blocks.map((block) => {
    const b = block.trim();
    if (!b) return "";

    // If block is an HTML tag (opening tag, comment, or closing tag)
    if (/^<(?:\/?[a-zA-Z][a-zA-Z0-9]*\b|!--)/.test(b)) {
      return b;
    }

    // Unordered Markdown lists
    if (b.startsWith("- ") || b.startsWith("* ")) {
      const items = b
        .split("\n")
        .map((item) => `<li class="ml-5 list-disc">${item.replace(/^[-*]\s+/, "")}</li>`)
        .join("");
      return `<ul class="my-4 space-y-2 pl-2">${items}</ul>`;
    }

    // Ordered Markdown lists
    if (/^\d+\.\s/.test(b)) {
      const items = b
        .split("\n")
        .map((item) => `<li class="ml-5 list-decimal">${item.replace(/^\d+\.\s+/, "")}</li>`)
        .join("");
      return `<ol class="my-4 space-y-2 pl-2">${items}</ol>`;
    }

    // Regular text paragraph
    return `<p class="my-4 leading-relaxed">${b.replace(/\n/g, "<br />")}</p>`;
  });

  return processed.filter(Boolean).join("\n\n");
}

export function BlogBody({ content }: { content: string }) {
  const html = useMemo(() => renderBlogHtml(content), [content]);

  return (
    <div
      className="prose prose-invert max-w-none space-y-4 text-base leading-8 text-foreground/90 font-normal [&_h1]:text-3xl [&_h1]:font-black [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_blockquote]:border-l-4 [&_blockquote]:border-electric [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_table]:w-full [&_table]:border [&_table]:border-border [&_table]:my-6 [&_th]:border [&_th]:border-border [&_th]:bg-card [&_th]:p-3 [&_th]:text-left [&_th]:font-bold [&_td]:border [&_td]:border-border [&_td]:p-3 [&_iframe]:w-full [&_iframe]:rounded-xl [&_iframe]:my-6 [&_img]:rounded-xl [&_img]:border [&_img]:border-border [&_img]:my-6 [&_a]:text-electric [&_a]:underline hover:[&_a]:text-electric/80 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:bg-card [&_pre]:overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
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
    if (!isBlogApiAvailable()) {
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
        {!isBlogApiAvailable() && <ConfigMissing />}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading blogs
          </div>
        )}
        {error && <div className="rounded-xl border border-destructive/40 p-5 text-sm">{error}</div>}
        {!loading && posts.length === 0 && isBlogApiAvailable() && (
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

                {/* Author row with DP */}
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {post.author_avatar_url ? (
                      <img
                        src={post.author_avatar_url}
                        alt={post.author_name || "Author"}
                        className="w-5 h-5 rounded-full object-cover border border-electric/30"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-electric/15 text-electric flex items-center justify-center font-bold text-[9px]">
                        {post.author_name ? post.author_name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                      </div>
                    )}
                    <span className="font-medium text-foreground">{post.author_name || "TERRA-X Team"}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 font-semibold text-electric group-hover:translate-x-0.5 transition-transform">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </div>
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isBlogApiAvailable()) {
      setLoading(false);
      return;
    }

    const session = getStoredSession();
    fetchPublishedPostBySlug(slug, session?.access_token)
      .then(setPost)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Dynamically set canonical and meta tags for the blog page
  useEffect(() => {
    if (typeof document === "undefined") return;

    const defaultCanonical = `https://terraxopc.com/blog/${slug}`;
    const canonical = post?.canonical_url?.trim() || defaultCanonical;
    const title = post?.meta_title || post?.title || "TERRA-X Blog | Autonomous Heavy Machinery Insights";
    const desc = post?.meta_description || post?.excerpt || "Read TERRA-X updates, robotics insights, autonomous excavator articles, and heavy machinery innovation notes.";

    document.title = title;

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement("link");
      linkCanonical.setAttribute("rel", "canonical");
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute("href", canonical);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonical);

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);

    if (post?.cover_image_url || post?.og_image_url) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute("content", post.og_image_url || post.cover_image_url || "");
    }

    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (post?.no_index) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else if (robotsMeta) {
      robotsMeta.remove();
    }
  }, [slug, post]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link & Share Button */}
        <div className="flex items-center justify-between mb-8">
          <a
            href="/blog"
            className="flex items-center gap-2 text-electric hover:underline font-medium transition-colors text-sm sm:text-base group"
          >
            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-medium shadow-soft"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                <span>Share post</span>
              </>
            )}
          </button>
        </div>

        {!isBlogApiAvailable() && <ConfigMissing />}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-14">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading blog...
          </div>
        )}
        {error && <div className="rounded-xl border border-destructive/40 p-5 text-sm text-destructive">{error}</div>}
        {!loading && !post && isBlogApiAvailable() && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <h1 className="text-3xl font-black">Blog not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">The article you are looking for doesn't exist or is unpublished.</p>
            <a href="/blog" className="mt-5 inline-flex text-sm font-semibold text-electric hover:underline">
              &larr; Back to blogs
            </a>
          </div>
        )}

        {post && (
          <>
            {/* Header exact match to reference design with Author DP */}
            <header className="mb-10 text-left">
              {/* Category Pill Tag */}
              <span className="inline-block bg-[#ECFCE8] text-[#005F20] dark:bg-emerald-500/15 dark:text-emerald-400 dark:border dark:border-emerald-500/30 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
                {post.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground leading-[1.18] mb-6 tracking-tight">
                {post.title}
              </h1>

              {/* Meta Info Row with Circular Author DP in front */}
              <div className="flex flex-wrap items-center gap-3.5 text-sm sm:text-base text-muted-foreground border-b border-border/80 pb-6">
                <div className="flex items-center gap-2.5">
                  {post.author_avatar_url ? (
                    <img
                      src={post.author_avatar_url}
                      alt={post.author_name || "Author"}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-electric/40 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-electric/15 text-electric border border-electric/40 flex items-center justify-center font-bold text-xs shrink-0">
                      {post.author_name ? post.author_name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                  )}
                  <span className="font-semibold text-foreground">
                    By {post.author_name || "TERRA-X Team"}
                  </span>
                </div>
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                <span>{formatFullDate(post.post_date || post.published_at)}</span>
                <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                <span>{formatReadTime(post.read_time)}</span>
              </div>
            </header>

            {/* Cover Image */}
            {post.cover_image_url && (
              <div className="w-full rounded-2xl overflow-hidden mb-12 border border-border shadow-soft">
                <img
                  src={post.cover_image_url}
                  alt={post.image_alt_text || post.title}
                  title={post.image_title || post.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <BlogBody content={post.content} />

            {/* Tags Cloud */}
            {Array.isArray(post.tags) && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-12 pt-8 border-t border-border">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground border border-border"
                  >
                    <Tag className="h-3 w-3 text-electric" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Section at end of blog */}
            <div className="mt-14 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {post.author_avatar_url ? (
                  <img
                    src={post.author_avatar_url}
                    alt={post.author_name || "Author"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-electric/30 ring-4 ring-primary/5 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-electric/15 text-electric border-2 border-electric/30 flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
                    {post.author_name ? post.author_name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-electric font-bold">
                        Written by
                      </span>
                      <h3 className="text-xl font-bold text-foreground">
                        {post.author_name || "TERRA-X Team"}
                      </h3>
                      {post.author_role && (
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">
                          {post.author_role}
                        </p>
                      )}
                    </div>

                    {post.author_social_url && (
                      <a
                        href={post.author_social_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-muted text-foreground text-xs font-semibold transition"
                      >
                        <span>Connect</span>
                        <ExternalLink className="w-3.5 h-3.5 text-electric" />
                      </a>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {post.author_bio ||
                      `Specialist and contributor at TERRA-X, writing on autonomous machinery, heavy equipment electrification, robotics intelligence, and industrial safety.`}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function LoginPanel({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function friendlyError(err: unknown) {
    const message = err instanceof Error ? err.message : "Request failed";
    return message;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const session = await signInAdmin(email, password);
      onLogin(session.access_token);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft"
    >
      <div className="mb-6 flex items-center justify-between">
        <a href="/" title="TERRA-X Home" className="transition hover:opacity-80">
          <img src={logo} alt="TERRA-X Logo" className="h-10 w-auto" />
        </a>
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-electric/10 text-electric">
          <Lock className="h-4 w-4" />
        </div>
      </div>
      <h1 className="text-2xl font-black">TERRA-X Admin Login</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sign in to access Blog &amp; User Management.
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
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Login to Console
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
  const [formTab, setFormTab] = useState<"content" | "seo">("content");
  const [editorTab, setEditorTab] = useState<"write" | "preview">("write");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mobileUploading, setMobileUploading] = useState(false);
  const [seoUploading, setSeoUploading] = useState(false);
  const [authorUploading, setAuthorUploading] = useState(false);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);
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
      mobile_image_url: selectedPost.mobile_image_url || "",
      post_date: selectedPost.post_date || new Date().toISOString().slice(0, 10),
      read_time: selectedPost.read_time || "5 min read",
      image_alt_text: selectedPost.image_alt_text || "",
      image_title: selectedPost.image_title || "",
      meta_title: selectedPost.meta_title || selectedPost.title,
      meta_description: selectedPost.meta_description || selectedPost.excerpt,
      canonical_url: selectedPost.canonical_url || "",
      author_name: selectedPost.author_name || "TERRA-X Team",
      author_role: selectedPost.author_role || "",
      author_bio: selectedPost.author_bio || "",
      author_avatar_url: selectedPost.author_avatar_url || "",
      author_social_url: selectedPost.author_social_url || "",
      category: selectedPost.category || "Technology",
      status: selectedPost.status || "draft",
      tags: Array.isArray(selectedPost.tags) ? selectedPost.tags : [],
      og_image_url: selectedPost.og_image_url || "",
      meta_keywords: selectedPost.meta_keywords || "",
      no_index: Boolean(selectedPost.no_index),
      head_scripts: selectedPost.head_scripts || "",
      body_scripts: selectedPost.body_scripts || "",
      schema_markup: selectedPost.schema_markup || "",
    });
  }, [selectedPost]);

  const previewSlug = useMemo(() => createSlug(form.slug || form.title), [form.slug, form.title]);

  function setField<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleAddTag() {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (!trimmed) return;
    const currentTags = form.tags || [];
    if (!currentTags.includes(trimmed)) {
      setField("tags", [...currentTags, trimmed]);
    }
    setTagInput("");
  }

  function handleRemoveTag(tagToRemove: string) {
    const currentTags = form.tags || [];
    setField("tags", currentTags.filter((t) => t !== tagToRemove));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  }

  async function handleDuplicatePost() {
    if (!selectedPost) return;
    setDuplicating(true);
    setError("");
    try {
      await duplicatePost(selectedPost.id, token);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to duplicate post");
    } finally {
      setDuplicating(false);
    }
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
      setError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleMobileImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMobileUploading(true);
    setError("");

    try {
      const publicUrl = await uploadBlogImage(file, token);
      setField("mobile_image_url", publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mobile image upload failed");
    } finally {
      setMobileUploading(false);
      event.target.value = "";
    }
  }

  async function handleSeoImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSeoUploading(true);
    setError("");

    try {
      const publicUrl = await uploadBlogImage(file, token);
      setField("og_image_url", publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "SEO image upload failed");
    } finally {
      setSeoUploading(false);
      event.target.value = "";
    }
  }

  async function handleAuthorAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAuthorUploading(true);
    setError("");

    try {
      const publicUrl = await uploadBlogImage(file, token);
      setField("author_avatar_url", publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Author photo upload failed");
    } finally {
      setAuthorUploading(false);
      event.target.value = "";
    }
  }

  async function handlePdfUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setParsingPdf(true);
    setError("");
    setPdfSuccess("");

    try {
      const parsed = await parseBlogPdf(file, token);
      setForm((current) => ({
        ...current,
        title: parsed.title || current.title,
        slug: parsed.slug || current.slug,
        excerpt: parsed.excerpt || current.excerpt,
        content: parsed.content || current.content,
        read_time: parsed.read_time || current.read_time,
        category: parsed.category || current.category,
        meta_title: parsed.meta_title || current.meta_title,
        meta_description: parsed.meta_description || current.meta_description,
      }));
      setPdfSuccess(`Auto-populated details from "${file.name}"!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract details from PDF.");
    } finally {
      setParsingPdf(false);
      event.target.value = "";
    }
  }

  function insertContent(prefix: string, suffix = "") {
    setField("content", `${form.content}${form.content ? "\n" : ""}${prefix}${suffix}`);
  }

  function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
      <label className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-1">
        <span>{children}</span>
        {required && <span className="text-destructive font-bold">*</span>}
      </label>
    );
  }

  function copyLiveUrl() {
    const url = `https://terraxopc.com/blog/${previewSlug || "blog-slug"}`;
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-soft space-y-6">
      {/* Top Form Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black">{selectedPost ? "Edit Blog Post" : "Create New Post"}</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider ${
                form.status === "published"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
              }`}
            >
              {form.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {selectedPost ? `Editing "${selectedPost.title}"` : "Write, format, configure SEO & publish articles"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedPost && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={duplicating}
                onClick={handleDuplicatePost}
                title="Duplicate post as a new draft"
              >
                {duplicating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />}
                Duplicate
              </Button>
              <a
                href={`/blog/${form.slug || previewSlug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition"
              >
                <ExternalLink className="h-3.5 w-3.5 text-electric" />
                Live View
              </a>
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                <Plus className="h-3.5 w-3.5" /> New Post
              </Button>
            </>
          )}

          <div className="flex items-center rounded-lg border border-border bg-background p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setField("status", "draft")}
              className={`rounded px-2.5 py-1 font-semibold transition ${
                form.status === "draft"
                  ? "bg-amber-500 text-black font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setField("status", "published")}
              className={`rounded px-2.5 py-1 font-semibold transition ${
                form.status === "published"
                  ? "bg-emerald-500 text-black font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Published
            </button>
          </div>

          <Button disabled={saving} size="sm" className="shadow-glow font-bold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {selectedPost ? "Update Post" : "Save Post"}
          </Button>
        </div>
      </div>

      {/* PDF Document Autofill Card */}
      <div className="rounded-xl border border-electric/40 bg-gradient-to-r from-electric/10 via-electric/5 to-transparent p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-electric/20 text-electric">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Import Details from PDF Document</p>
              <p className="text-xs text-muted-foreground">
                Auto-extract Title, Excerpt, Content, Read Time &amp; SEO tags directly from PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/sample-blog-post.pdf"
              download="sample-blog-post.pdf"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              title="Download test PDF document"
            >
              <FileDown className="h-3.5 w-3.5 text-electric" />
              Download Sample PDF
            </a>

            <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow hover:bg-primary/90 transition">
              {parsingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {parsingPdf ? "Parsing PDF..." : "Upload PDF"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handlePdfUpload}
                disabled={parsingPdf}
              />
            </label>
          </div>
        </div>

        {pdfSuccess && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-400 font-mono">
            <Check className="h-3.5 w-3.5 shrink-0" />
            <span>{pdfSuccess}</span>
          </div>
        )}
      </div>

      {/* Live Slug & URL preview banner with Copy button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-border/80 bg-background/60 p-3 text-xs font-mono text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="h-4 w-4 shrink-0 text-electric" />
          <span className="font-semibold text-muted-foreground shrink-0">URL:</span>
          <span className="truncate text-foreground font-medium select-all">
            https://terraxopc.com/blog/{previewSlug || "blog-slug"}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={copyLiveUrl}
            className="inline-flex items-center gap-1 rounded bg-secondary px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted transition"
          >
            {copiedUrl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedUrl ? "Copied!" : "Copy URL"}
          </button>
        </div>
      </div>

      {/* ADWIN-STYLE TABS: Content vs SEO */}
      <div className="border-b border-border">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormTab("content")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              formTab === "content"
                ? "border-electric text-electric"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Content
          </button>
          <button
            type="button"
            onClick={() => setFormTab("seo")}
            className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              formTab === "seo"
                ? "border-electric text-electric"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-4 w-4" />
            SEO &amp; Meta
          </button>
        </div>
      </div>

      {/* TAB 1: CONTENT */}
      {formTab === "content" && (
        <div className="space-y-5">
          {/* Title & Slug */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel required>Title</FieldLabel>
              <Input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                placeholder="e.g. Next-Gen Autonomous Heavy Machinery"
                required
              />
            </div>
            <div className="space-y-2">
              <FieldLabel required>Slug</FieldLabel>
              <Input
                value={form.slug}
                onChange={(event) => setField("slug", event.target.value)}
                placeholder={previewSlug || "blog-slug"}
                required
              />
              <p className="text-[11px] text-muted-foreground font-mono">
                Auto-formatted URL identifier (e.g. "my-post")
              </p>
            </div>
          </div>

          {/* Excerpt / Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <FieldLabel required>Description / Summary</FieldLabel>
              <span className="text-[10px] font-mono text-muted-foreground">
                {form.excerpt?.length || 0} characters (shown on cards)
              </span>
            </div>
            <Textarea
              value={form.excerpt}
              onChange={(event) => setField("excerpt", event.target.value)}
              placeholder="Short summary shown on blog cards and used as a fallback meta description."
              className="min-h-[75px]"
              required
            />
          </div>

          {/* Category, Date, Read Time */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <FieldLabel required>Category</FieldLabel>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="Technology">Technology</option>
                <option value="Excavators">Excavators</option>
                <option value="Robotics & AI">Robotics &amp; AI</option>
                <option value="Autonomous Fleet">Autonomous Fleet</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Rescue & Defense">Rescue &amp; Defense</option>
                <option value="Battery Tech">Battery Tech</option>
                <option value="Solar Energy">Solar Energy</option>
                <option value="E-Mobility">E-Mobility</option>
                <option value="Field Notes">Field Notes</option>
              </select>
            </div>

            <div className="space-y-2">
              <FieldLabel required>Publish Date</FieldLabel>
              <Input
                type="date"
                value={form.post_date}
                onChange={(e) => setField("post_date", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <FieldLabel required>Read Time</FieldLabel>
              <Input
                value={form.read_time}
                onChange={(e) => setField("read_time", e.target.value)}
                placeholder="5 min read"
                required
              />
            </div>
          </div>

          {/* Author Details Section Card */}
          <div className="rounded-xl border border-border bg-card/60 p-4 space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-electric/15 text-electric">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Author Section</p>
                <p className="text-[11px] text-muted-foreground">
                  Shown in the blog header and the dedicated "About the Author" card at the end of the post.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <FieldLabel required>Author Name</FieldLabel>
                <Input
                  value={form.author_name}
                  onChange={(e) => setField("author_name", e.target.value)}
                  placeholder="e.g. Vikash / Dr. Sarah Chen"
                  required
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>Author Role / Designation</FieldLabel>
                <Input
                  value={form.author_role || ""}
                  onChange={(e) => setField("author_role", e.target.value)}
                  placeholder="e.g. Lead Robotics Architect"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel>Social / Profile URL</FieldLabel>
                <Input
                  value={form.author_social_url || ""}
                  onChange={(e) => setField("author_social_url", e.target.value)}
                  placeholder="https://linkedin.com/in/author"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FieldLabel>Author Photo / Avatar</FieldLabel>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <Input
                    value={form.author_avatar_url || ""}
                    onChange={(e) => setField("author_avatar_url", e.target.value)}
                    placeholder="https://... or upload photo"
                  />
                  <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground transition hover:bg-secondary">
                    {authorUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                    Upload
                    <input type="file" accept="image/*" className="hidden" onChange={handleAuthorAvatarUpload} />
                  </label>
                </div>
                {form.author_avatar_url && (
                  <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-background p-2">
                    <img
                      src={form.author_avatar_url}
                      alt="Author preview"
                      className="h-10 w-10 rounded-full object-cover border border-border"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="truncate font-mono text-muted-foreground">{form.author_avatar_url}</p>
                      <button
                        type="button"
                        onClick={() => setField("author_avatar_url", "")}
                        className="text-destructive hover:underline text-[11px]"
                      >
                        Remove photo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <FieldLabel>Author Bio (End of Blog)</FieldLabel>
                <Textarea
                  value={form.author_bio || ""}
                  onChange={(e) => setField("author_bio", e.target.value)}
                  placeholder="Short biography displayed in the author card at the end of the blog post."
                  className="min-h-[75px]"
                />
              </div>
            </div>
          </div>

          {/* Desktop Cover Image & Mobile Cover Image */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Desktop Cover Image</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={form.cover_image_url}
                  onChange={(e) => setField("cover_image_url", e.target.value)}
                  placeholder="https://... or upload"
                />
                <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground transition hover:bg-secondary">
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              {form.cover_image_url && (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-background p-2">
                  <img
                    src={form.cover_image_url}
                    alt="Cover preview"
                    className="h-12 w-20 rounded object-cover border border-border"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="truncate font-mono text-muted-foreground">{form.cover_image_url}</p>
                    <button
                      type="button"
                      onClick={() => setField("cover_image_url", "")}
                      className="text-destructive hover:underline text-[11px]"
                    >
                      Remove image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <FieldLabel>Mobile Cover Image (Optional)</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={form.mobile_image_url || ""}
                  onChange={(e) => setField("mobile_image_url", e.target.value)}
                  placeholder="Optional mobile image"
                />
                <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground transition hover:bg-secondary">
                  {mobileUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Smartphone className="h-3.5 w-3.5" />}
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleMobileImageUpload} />
                </label>
              </div>
              {form.mobile_image_url && (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-background p-2">
                  <img
                    src={form.mobile_image_url}
                    alt="Mobile cover preview"
                    className="h-12 w-12 rounded object-cover border border-border"
                  />
                  <div className="min-w-0 flex-1 text-xs">
                    <p className="truncate font-mono text-muted-foreground">{form.mobile_image_url}</p>
                    <button
                      type="button"
                      onClick={() => setField("mobile_image_url", "")}
                      className="text-destructive hover:underline text-[11px]"
                    >
                      Remove mobile image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image Alt Text & Title */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Image Alt Text</FieldLabel>
              <Input
                value={form.image_alt_text}
                onChange={(e) => setField("image_alt_text", e.target.value)}
                placeholder="Autonomous excavator working in field"
              />
            </div>
            <div className="space-y-2">
              <FieldLabel>Image Title</FieldLabel>
              <Input
                value={form.image_title}
                onChange={(e) => setField("image_title", e.target.value)}
                placeholder="TERRA-X field operation"
              />
            </div>
          </div>

          {/* Tags Manager */}
          <div className="space-y-2">
            <FieldLabel>Tags</FieldLabel>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-input bg-background p-2.5">
              {(form.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-electric/15 px-2.5 py-1 text-xs font-mono font-semibold text-electric"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-electric/70 hover:text-destructive transition"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 flex-1 min-w-[140px]">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tag and press Enter..."
                  className="h-7 border-0 shadow-none focus-visible:ring-0 text-xs px-1"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddTag} className="h-7 px-2 text-xs">
                  + Add
                </Button>
              </div>
            </div>
          </div>

          {/* Rich Content Editor with Write/HTML and Live Preview tabs */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FieldLabel required>Article Body (Markdown &amp; Raw HTML)</FieldLabel>
                <span className="rounded bg-electric/15 px-2 py-0.5 text-[10px] font-mono font-bold text-electric uppercase tracking-wider">
                  Raw HTML &amp; Markdown Supported
                </span>
              </div>
              <div className="flex items-center rounded-lg border border-border bg-card p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorTab("write")}
                  className={`rounded-md px-3 py-1 font-semibold transition ${
                    editorTab === "write"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Write / HTML
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab("preview")}
                  className={`rounded-md px-3 py-1 font-semibold transition flex items-center gap-1 ${
                    editorTab === "preview"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Live Preview
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-input bg-background">
              {editorTab === "write" ? (
                <>
                  <div className="flex flex-wrap items-center gap-1 border-b border-input bg-card px-2 py-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertContent("## Heading Title")}>
                      H2
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => insertContent("### Subheading")}>
                      H3
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("**Bold text**")} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("*Italic text*")} title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("[Link text](https://)")} title="Link">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("- List item")} title="Bullet List">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("1. List item")} title="Numbered List">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" onClick={() => insertContent("> Quote text")} title="Quote">
                      <Quote className="h-4 w-4" />
                    </Button>
                    <div className="h-4 w-px bg-border mx-1" />
                    {/* HTML Snippet Generators */}
                    <span className="text-[10px] font-mono text-muted-foreground uppercase px-1">HTML:</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-mono text-electric"
                      onClick={() =>
                        insertContent(
                          '<div class="my-6 rounded-xl border border-electric/40 bg-card p-5 shadow-soft">\n  <h4 class="text-lg font-bold text-electric">⚡ Highlight Title</h4>\n  <p class="mt-2 text-muted-foreground">Add your custom styled HTML content or callout notice here.</p>\n</div>'
                        )
                      }
                      title="Insert Styled HTML Box"
                    >
                      &lt;Box /&gt;
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-mono text-electric"
                      onClick={() =>
                        insertContent(
                          '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">\n  <div class="p-4 rounded-xl border border-border bg-card/60">\n    <h5 class="font-bold text-foreground">Column 1</h5>\n    <p class="text-sm text-muted-foreground mt-1">Left side card details.</p>\n  </div>\n  <div class="p-4 rounded-xl border border-border bg-card/60">\n    <h5 class="font-bold text-foreground">Column 2</h5>\n    <p class="text-sm text-muted-foreground mt-1">Right side card details.</p>\n  </div>\n</div>'
                        )
                      }
                      title="Insert 2-Column HTML Grid"
                    >
                      &lt;Grid /&gt;
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-mono text-electric"
                      onClick={() =>
                        insertContent(
                          '<div class="overflow-x-auto my-6">\n  <table class="w-full border-collapse text-sm">\n    <thead>\n      <tr class="bg-card border-b border-border">\n        <th class="p-3 text-left">Feature</th>\n        <th class="p-3 text-left">Specification</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr class="border-b border-border">\n        <td class="p-3">Battery Capacity</td>\n        <td class="p-3">150 kWh</td>\n      </tr>\n    </tbody>\n  </table>\n</div>'
                        )
                      }
                      title="Insert HTML Table"
                    >
                      &lt;Table /&gt;
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-mono text-electric"
                      onClick={() =>
                        insertContent(
                          '<div class="my-6 text-center">\n  <a href="https://terraxopc.com/contact" class="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow hover:bg-primary/90 transition">\n    Explore Terra-X Fleet &rarr;\n  </a>\n</div>'
                        )
                      }
                      title="Insert CTA Button"
                    >
                      &lt;CTA /&gt;
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-mono text-electric"
                      onClick={() =>
                        insertContent(
                          '<div class="aspect-video w-full rounded-xl overflow-hidden my-6 border border-border">\n  <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>'
                        )
                      }
                      title="Insert Video Embed"
                    >
                      &lt;Embed /&gt;
                    </Button>
                  </div>
                  <Textarea
                    value={form.content}
                    onChange={(event) => setField("content", event.target.value)}
                    className="min-h-[380px] rounded-none border-0 shadow-none focus-visible:ring-0 font-mono text-sm leading-relaxed"
                    placeholder="Directly write or paste HTML (<div>, <table>, <iframe>, <h2>, <p>, <a>, <button>) or Markdown here..."
                    required
                  />
                </>
              ) : (
                <div className="min-h-[380px] p-6 bg-card/40 overflow-y-auto space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <p className="text-xs font-mono uppercase tracking-widest text-electric">
                      Live HTML, Markdown &amp; Author Preview
                    </p>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Renders header, body, tags &amp; author profile
                    </span>
                  </div>

                  {/* Header preview matching exact design */}
                  <div className="space-y-4">
                    <span className="inline-block bg-[#ECFCE8] text-[#005F20] dark:bg-emerald-500/15 dark:text-emerald-400 dark:border dark:border-emerald-500/30 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      {form.category || "Technology"}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight tracking-tight">
                      {form.title || "Blog Title Preview"}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground border-b border-border/80 pb-4">
                      <span className="font-semibold text-foreground">
                        By {form.author_name || "TERRA-X Team"}
                      </span>
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                      <span>{formatFullDate(form.post_date)}</span>
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                      <span>{formatReadTime(form.read_time)}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="rounded-xl border border-border/80 bg-background/80 p-6">
                    <BlogBody content={form.content || "<p class='text-muted-foreground italic'>No content written yet.</p>"} />
                  </div>

                  {/* Live Tags Preview */}
                  {Array.isArray(form.tags) && form.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Tags:</span>
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground border border-border"
                        >
                          <Tag className="h-3 w-3 text-electric" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Live Author Card Preview */}
                  <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-soft">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {form.author_avatar_url ? (
                        <img
                          src={form.author_avatar_url}
                          alt={form.author_name || "Author"}
                          className="w-14 h-14 rounded-full object-cover border-2 border-electric/30 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-electric/15 text-electric border-2 border-electric/30 flex items-center justify-center font-bold text-lg shrink-0">
                          {form.author_name ? form.author_name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-electric font-bold">
                              Written by
                            </span>
                            <h4 className="text-lg font-bold text-foreground">
                              {form.author_name || "TERRA-X Team"}
                            </h4>
                            {form.author_role && (
                              <p className="text-xs font-medium text-muted-foreground">
                                {form.author_role}
                              </p>
                            )}
                          </div>

                          {form.author_social_url && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-foreground text-xs font-semibold">
                              <span>Profile</span>
                              <ExternalLink className="w-3 h-3 text-electric" />
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {form.author_bio ||
                            `Specialist and contributor at TERRA-X, writing on autonomous machinery, heavy equipment electrification, robotics intelligence, and industrial safety.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              💡 <strong>Direct HTML Supported:</strong> You can paste standard HTML tags (<code>&lt;div&gt;</code>, <code>&lt;table&gt;</code>, <code>&lt;iframe&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;style&gt;</code>, <code>&lt;a&gt;</code>, etc.) directly into the editor and preview in real-time.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: SEO & META */}
      {formTab === "seo" && (
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-background/40 p-4 text-xs text-muted-foreground">
            Configure search engine optimization, Open Graph social share cards, canonical URLs, indexing, and custom tracking scripts.
          </div>

          {/* SEO Title & Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>SEO Title (Meta Title)</FieldLabel>
                <span
                  className={`text-[11px] font-mono ${
                    (form.meta_title?.length || 0) > 60 ? "text-amber-400" : "text-muted-foreground"
                  }`}
                >
                  {form.meta_title?.length || 0} / 60 chars (Recommended: 50–60)
                </span>
              </div>
              <Input
                value={form.meta_title}
                onChange={(e) => setField("meta_title", e.target.value)}
                placeholder={form.title || "TERRA-X autonomous machinery guide"}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FieldLabel>SEO Description (Meta Description)</FieldLabel>
                <span
                  className={`text-[11px] font-mono ${
                    (form.meta_description?.length || 0) > 160 ? "text-amber-400" : "text-muted-foreground"
                  }`}
                >
                  {form.meta_description?.length || 0} / 160 chars (Recommended: 150–160)
                </span>
              </div>
              <Textarea
                value={form.meta_description}
                onChange={(e) => setField("meta_description", e.target.value)}
                placeholder="Meta description for search results and social previews. Leave blank to use post summary."
                className="min-h-[75px]"
              />
            </div>
          </div>

          {/* Open Graph Image & Canonical URL */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Social Share Image (OG Image)</FieldLabel>
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <Input
                  value={form.og_image_url || ""}
                  onChange={(e) => setField("og_image_url", e.target.value)}
                  placeholder="https://... (1200x630px recommended)"
                />
                <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-xs font-semibold text-foreground transition hover:bg-secondary">
                  {seoUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleSeoImageUpload} />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel>Canonical URL Override</FieldLabel>
              <Input
                value={form.canonical_url}
                onChange={(e) => setField("canonical_url", e.target.value)}
                placeholder={`https://terraxopc.com/blog/${previewSlug || "slug"}`}
              />
            </div>
          </div>

          {/* Keywords & No Index */}
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <FieldLabel>Meta Keywords</FieldLabel>
              <Input
                value={form.meta_keywords || ""}
                onChange={(e) => setField("meta_keywords", e.target.value)}
                placeholder="autonomous excavators, heavy robotics, ai construction, battery machinery"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={Boolean(form.no_index)}
                  onChange={(e) => setField("no_index", e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-electric"
                />
                <span>No Index (Hide from search engines)</span>
              </label>
            </div>
          </div>

          {/* Head Scripts, Body Scripts & Schema Markup */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <FieldLabel>Head Scripts (&lt;head&gt;)</FieldLabel>
              <Textarea
                value={form.head_scripts || ""}
                onChange={(e) => setField("head_scripts", e.target.value)}
                placeholder="Optional HTML/scripts injected into <head> on this post only (e.g. GTM, tracking pixels)."
                className="min-h-[90px] font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <FieldLabel>Body Scripts (&lt;body&gt;)</FieldLabel>
              <Textarea
                value={form.body_scripts || ""}
                onChange={(e) => setField("body_scripts", e.target.value)}
                placeholder="Optional HTML/scripts injected at end of <body> on this post only."
                className="min-h-[90px] font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabel>Custom Schema Markup (JSON-LD)</FieldLabel>
            <Textarea
              value={form.schema_markup || ""}
              onChange={(e) => setField("schema_markup", e.target.value)}
              placeholder="Optional JSON-LD structured data override. Leave blank to use auto-generated BlogPosting schema."
              className="min-h-[90px] font-mono text-xs"
            />
          </div>
        </div>
      )}

      {/* Form Error & Submit Bar */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <span>Status:</span>
          <span className={form.status === "published" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
            {form.status.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedPost && (
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel Edit
            </Button>
          )}
          <Button disabled={saving} className="shadow-glow font-bold">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {selectedPost ? "Update Blog Post" : "Save Blog Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function UserManagementSection({
  token,
  currentAdminEmail,
}: {
  token: string;
  currentAdminEmail?: string;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create user form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [creating, setCreating] = useState(false);

  // Change password state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  async function loadUsers() {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminUsers(token);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [token]);

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setCreating(true);
    try {
      await createAdminUser({ email: newEmail, password: newPassword }, token);
      setSuccess(`Admin user ${newEmail} created successfully!`);
      setNewEmail("");
      setNewPassword("");
      setConfirmPassword("");
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdatePassword(userId: string) {
    setError("");
    setSuccess("");

    if (editPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (editPassword !== editConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await updateAdminUserPassword(userId, editPassword, token);
      setSuccess("Password updated successfully!");
      setEditingUserId(null);
      setEditPassword("");
      setEditConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    setError("");
    setSuccess("");

    if (user.email.toLowerCase() === currentAdminEmail?.toLowerCase()) {
      alert("You cannot delete your own logged-in administrator account.");
      return;
    }

    if (users.length <= 1) {
      alert("Cannot delete the only remaining administrator account.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete administrator "${user.email}"?`)) {
      return;
    }

    try {
      await deleteAdminUser(user.id, token);
      setSuccess(`Administrator ${user.email} was removed.`);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  return (
    <div className="space-y-8">
      {/* Alert Messages */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-auto text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Total Admins
            </span>
            <Users className="h-4 w-4 text-electric" />
          </div>
          <p className="mt-3 text-3xl font-black">{users.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Authorized Team Members</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Your Session
            </span>
            <UserCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-3 truncate text-sm font-bold text-foreground">
            {currentAdminEmail || "admin"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Secured &amp; Active</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Security
            </span>
            <ShieldCheck className="h-4 w-4 text-electric" />
          </div>
          <p className="mt-3 text-sm font-bold text-foreground">Fully Secured</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <Lock className="h-3 w-3 shrink-0" />
            <span>System Protected</span>
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Create User Form */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-electric/10 text-electric">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black">Add New Admin</h2>
              <p className="text-xs text-muted-foreground">Create administrative credentials</p>
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@company.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Password (min. 6 chars)
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button className="w-full" disabled={creating}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create Admin Account
            </Button>
          </form>
        </div>

        {/* Admin Users List */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-electric/10 text-electric">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black">Administrator Accounts</h2>
                <p className="text-xs text-muted-foreground">Manage authorized users</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {loading && users.length === 0 && (
              <div className="flex items-center gap-2 py-8 text-center text-sm text-muted-foreground justify-center">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading administrators...
              </div>
            )}

            {users.map((user) => {
              const isCurrent = user.email.toLowerCase() === currentAdminEmail?.toLowerCase();
              const isEditing = editingUserId === user.id;

              return (
                <div
                  key={user.id}
                  className={`rounded-xl border p-4 transition ${
                    isCurrent
                      ? "border-electric/40 bg-electric/5"
                      : "border-border bg-background/60"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">{user.email}</span>
                        {isCurrent && (
                          <span className="rounded-full bg-electric/20 px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-electric">
                            You
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Shield className="h-3 w-3 text-muted-foreground" /> Super Admin
                        </span>
                        <span>•</span>
                        <span>Joined {formatDate(user.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        type="button"
                        variant={isEditing ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isEditing) {
                            setEditingUserId(null);
                          } else {
                            setEditingUserId(user.id);
                            setEditPassword("");
                            setEditConfirmPassword("");
                          }
                        }}
                      >
                        <Key className="h-3.5 w-3.5" />
                        {isEditing ? "Close" : "Password"}
                      </Button>

                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isCurrent || users.length <= 1}
                        title={
                          isCurrent
                            ? "Cannot delete current logged-in account"
                            : users.length <= 1
                              ? "Cannot delete the last admin"
                              : "Delete admin"
                        }
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Inline Change Password Form */}
                  {isEditing && (
                    <div className="mt-4 rounded-lg border border-border bg-card p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-electric">
                        <span>Reset Password for {user.email}</span>
                        <button
                          type="button"
                          onClick={() => setEditingUserId(null)}
                          className="hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                          type="password"
                          placeholder="New password (min 6)"
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                        />
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          value={editConfirmPassword}
                          onChange={(e) => setEditConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUserId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={updatingPassword}
                          onClick={() => handleUpdatePassword(user.id)}
                        >
                          {updatingPassword ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Save className="h-3.5 w-3.5" />
                          )}
                          Update Password
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveBlogExplorerSection({
  posts,
  onEditPost,
  onDuplicatePost,
  onDeletePost,
  actionLoadingId,
  loading,
}: {
  posts: BlogPost[];
  onEditPost: (post: BlogPost) => void;
  onDuplicatePost: (post: BlogPost) => void;
  onDeletePost: (post: BlogPost) => void;
  actionLoadingId?: string | null;
  loading: boolean;
}) {
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    if (posts.length > 0 && !selectedSlug) {
      setSelectedSlug(posts[0].slug);
    }
  }, [posts, selectedSlug]);

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false;
      if (categoryFilter !== "all" && post.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inSlug = post.slug.toLowerCase().includes(q);
        const inExcerpt = post.excerpt?.toLowerCase().includes(q);
        const inCategory = post.category?.toLowerCase().includes(q);
        const inAuthor = post.author_name?.toLowerCase().includes(q);
        const inTags = (post.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inSlug && !inExcerpt && !inCategory && !inAuthor && !inTags) return false;
      }
      return true;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const activePost = useMemo(() => {
    return posts.find((p) => p.slug === selectedSlug) || filteredPosts[0] || posts[0] || null;
  }, [posts, selectedSlug, filteredPosts]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-foreground">Live Blog Explorer &amp; Showcase</h2>
            <span className="rounded-full bg-electric/15 px-2.5 py-0.5 text-xs font-mono font-bold text-electric">
              Live Preview
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Browse all blog articles and instantly inspect their full responsive rendering, typography, direct HTML, and author cards.
          </p>
        </div>

        {/* Responsive Device View Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-border bg-background p-1 text-xs">
          <button
            type="button"
            onClick={() => setDeviceView("desktop")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
              deviceView === "desktop"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("tablet")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
              deviceView === "tablet"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceView("mobile")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-semibold transition ${
              deviceView === "mobile"
                ? "bg-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile (390px)</span>
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Left Column: All Blogs List */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <span className="text-xs font-mono uppercase tracking-widest text-electric font-bold">
              All Blogs ({filteredPosts.length})
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              Click to live inspect
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
            <div className="flex items-center rounded-lg border border-border bg-background p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded px-2 py-0.5 font-semibold transition ${
                  statusFilter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("published")}
                className={`rounded px-2 py-0.5 font-semibold transition ${
                  statusFilter === "published" ? "bg-emerald-500 text-black font-bold" : "text-muted-foreground"
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`rounded px-2 py-0.5 font-semibold transition ${
                  statusFilter === "draft" ? "bg-amber-500 text-black font-bold" : "text-muted-foreground"
                }`}
              >
                Draft
              </button>
            </div>

            {categoriesList.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-7 rounded-md border border-input bg-background px-2 text-[11px] font-medium"
              >
                <option value="all">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* List of Posts */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1 pt-1">
            {filteredPosts.map((post) => {
              const isCurrent = activePost?.id === post.id;

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedSlug(post.slug)}
                  className={`cursor-pointer rounded-xl border p-3 transition text-left ${
                    isCurrent
                      ? "border-electric bg-electric/10 shadow-glow"
                      : "border-border bg-background/50 hover:bg-background/90 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="h-14 w-16 shrink-0 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="grid h-14 w-16 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground border border-border">
                        <FileText className="h-5 w-5 opacity-50" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider">
                        <span
                          className={`rounded-full px-1.5 py-0.2 font-bold ${
                            post.status === "published"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-amber-500/15 text-amber-400"
                          }`}
                        >
                          {post.status}
                        </span>
                        <span className="text-electric font-semibold truncate max-w-[100px]">{post.category}</span>
                      </div>

                      <h4 className="mt-1 text-xs font-bold text-foreground leading-snug line-clamp-2">
                        {post.title}
                      </h4>

                      {/* Author row with DP & quick delete */}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/40 pt-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {post.author_avatar_url ? (
                            <img
                              src={post.author_avatar_url}
                              alt={post.author_name}
                              className="h-4 w-4 rounded-full object-cover border border-border shrink-0"
                            />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-electric/15 text-electric flex items-center justify-center font-bold text-[8px] shrink-0">
                              {post.author_name ? post.author_name.charAt(0).toUpperCase() : "A"}
                            </div>
                          )}
                          <span className="truncate text-[10px]">{post.author_name}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px]">{postDisplayDate(post)}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePost(post);
                            }}
                            disabled={actionLoadingId === post.id}
                            className="text-muted-foreground hover:text-destructive p-0.5 rounded transition"
                            title={`Delete post "${post.title}"`}
                          >
                            {actionLoadingId === post.id ? (
                              <Loader2 className="h-3 w-3 animate-spin text-destructive" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPosts.length === 0 && (
              <div className="rounded-xl border border-border p-6 text-center text-xs text-muted-foreground">
                No matching posts found.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Live Post Showcase Frame */}
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          {activePost ? (
            <div>
              {/* Showcase Frame Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background/80 px-4 py-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-destructive/60" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/60" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/60" />
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-1 text-xs font-mono text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 text-electric shrink-0" />
                    <span className="text-foreground select-all truncate">
                      https://terraxopc.com/blog/{activePost.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-semibold"
                    onClick={() => onEditPost(activePost)}
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1 text-electric" />
                    Edit Post
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs"
                    onClick={() => onDuplicatePost(activePost)}
                    title="Duplicate post"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>

                  <a
                    href={`/blog/${activePost.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 h-8 px-3 rounded-md border border-input text-foreground text-xs font-semibold transition hover:bg-secondary"
                  >
                    <span>Open Live</span>
                    <ExternalLink className="h-3.5 w-3.5 text-electric" />
                  </a>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2.5 text-xs font-semibold"
                    disabled={actionLoadingId === activePost.id}
                    onClick={() => onDeletePost(activePost)}
                    title="Delete blog post"
                  >
                    {actionLoadingId === activePost.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span className="ml-1 hidden sm:inline">Delete</span>
                  </Button>
                </div>
              </div>

              {/* Dynamic Viewport Container */}
              <div className="p-4 sm:p-6 bg-background/40 flex justify-center min-h-[600px] overflow-x-auto">
                <div
                  className={`w-full transition-all duration-300 rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-soft ${
                    deviceView === "mobile"
                      ? "max-w-[400px]"
                      : deviceView === "tablet"
                      ? "max-w-[768px]"
                      : "max-w-4xl"
                  }`}
                >
                  {/* Blog Header exact match */}
                  <header className="mb-8 text-left">
                    {/* Category tag */}
                    <span className="inline-block bg-[#ECFCE8] text-[#005F20] dark:bg-emerald-500/15 dark:text-emerald-400 dark:border dark:border-emerald-500/30 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider mb-5">
                      {activePost.category}
                    </span>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-[1.18] mb-6 tracking-tight">
                      {activePost.title}
                    </h1>

                    {/* Meta Row with Circular Author DP */}
                    <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm text-muted-foreground border-b border-border/80 pb-6">
                      <div className="flex items-center gap-2">
                        {activePost.author_avatar_url ? (
                          <img
                            src={activePost.author_avatar_url}
                            alt={activePost.author_name || "Author"}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-electric/40 shadow-xs"
                          />
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-electric/15 text-electric border border-electric/40 flex items-center justify-center font-bold text-xs">
                            {activePost.author_name ? activePost.author_name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                          </div>
                        )}
                        <span className="font-semibold text-foreground">
                          By {activePost.author_name || "TERRA-X Team"}
                        </span>
                      </div>
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                      <span>{formatFullDate(activePost.post_date || activePost.published_at)}</span>
                      <span className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full" />
                      <span>{formatReadTime(activePost.read_time)}</span>
                    </div>
                  </header>

                  {/* Cover Image */}
                  {activePost.cover_image_url && (
                    <div className="w-full rounded-2xl overflow-hidden mb-10 border border-border shadow-soft">
                      <img
                        src={activePost.cover_image_url}
                        alt={activePost.image_alt_text || activePost.title}
                        title={activePost.image_title || activePost.title}
                        className="w-full aspect-[16/9] object-cover"
                      />
                    </div>
                  )}

                  {/* Body Content */}
                  <BlogBody content={activePost.content} />

                  {/* Tag Cloud */}
                  {Array.isArray(activePost.tags) && activePost.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-border">
                      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground mr-1">Tags:</span>
                      {activePost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-md bg-secondary px-3 py-1 text-xs font-medium text-foreground border border-border"
                        >
                          <Tag className="h-3 w-3 text-electric" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author Card at End of Blog */}
                  <div className="mt-12 rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-6 sm:p-8 shadow-soft">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      {activePost.author_avatar_url ? (
                        <img
                          src={activePost.author_avatar_url}
                          alt={activePost.author_name || "Author"}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-electric/30 ring-4 ring-primary/5 shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-electric/15 text-electric border-2 border-electric/30 flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0">
                          {activePost.author_name ? activePost.author_name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-mono uppercase tracking-widest text-electric font-bold">
                              Written by
                            </span>
                            <h3 className="text-xl font-bold text-foreground">
                              {activePost.author_name || "TERRA-X Team"}
                            </h3>
                            {activePost.author_role && (
                              <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">
                                {activePost.author_role}
                              </p>
                            )}
                          </div>

                          {activePost.author_social_url && (
                            <a
                              href={activePost.author_social_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-muted text-foreground text-xs font-semibold transition"
                            >
                              <span>Connect</span>
                              <ExternalLink className="w-3.5 h-3.5 text-electric" />
                            </a>
                          )}
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                          {activePost.author_bio ||
                            `Specialist and contributor at TERRA-X, writing on autonomous machinery, heavy equipment electrification, robotics intelligence, and industrial safety.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 text-electric/40 mb-3" />
              <p className="text-base font-bold text-foreground">Select a blog post to preview</p>
              <p className="text-xs mt-1">Choose any article from the left list to see its live interactive layout.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BlogAdminPage({ defaultTab = "blogs" }: { defaultTab?: "blogs" | "showcase" | "users" }) {
  const storedSession = typeof window !== "undefined" ? getStoredSession() : null;
  const [token, setToken] = useState(storedSession?.access_token || "");
  const [activeTab, setActiveTab] = useState<"blogs" | "showcase" | "users">(defaultTab);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentAdminEmail = storedSession?.user?.email || "admin@terraxnexus.local";

  async function loadPosts(activeToken = token) {
    if (!activeToken || !isBlogApiAvailable()) return;
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
    if (!window.confirm(`Are you sure you want to delete post "${post.title}"?`)) return;

    setActionLoadingId(post.id);
    try {
      await deletePost(post.id, token);
      if (selectedPost?.id === post.id) setSelectedPost(null);
      loadPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDuplicate(post: BlogPost) {
    setActionLoadingId(post.id);
    setError("");
    try {
      const duplicated = await duplicatePost(post.id, token);
      await loadPosts();
      setSelectedPost(duplicated);
      setActiveTab("blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplication failed");
    } finally {
      setActionLoadingId(null);
    }
  }

  function handleEditFromShowcase(post: BlogPost) {
    setSelectedPost(post);
    setActiveTab("blogs");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSignOut() {
    if (token) await signOutAdmin();
    clearStoredSession();
    setToken("");
    setPosts([]);
    setSelectedPost(null);
  }

  // Filtered posts calculation
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (statusFilter !== "all" && post.status !== statusFilter) return false;
      if (categoryFilter !== "all" && post.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inSlug = post.slug.toLowerCase().includes(q);
        const inExcerpt = post.excerpt?.toLowerCase().includes(q);
        const inCategory = post.category?.toLowerCase().includes(q);
        const inTags = (post.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inSlug && !inExcerpt && !inCategory && !inTags) return false;
      }
      return true;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!isBlogApiAvailable() && <ConfigMissing />}
        {!token && isBlogApiAvailable() && <LoginPanel onLogin={setToken} />}
        {token && (
          <>
            {/* Top Admin Header with Logo */}
            <div className="mb-8 flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <a href="/" className="inline-block transition hover:opacity-85" title="Go to Home">
                  <img src={logo} alt="TERRA-X Logo" className="h-10 sm:h-12 w-auto" />
                </a>
                <div className="h-8 w-px bg-border hidden sm:block" />
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-electric">
                    <span className="h-px w-6 bg-electric" /> Control Panel
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Admin Console</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <a
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition hover:bg-secondary"
                  title="View Public Website"
                >
                  <Globe className="h-3.5 w-3.5 text-electric" />
                  <span>Public Site</span>
                </a>

                <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-mono text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-foreground">{currentAdminEmail}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs">
                  <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
                </Button>
              </div>
            </div>

            {/* Navigation Tabs for All 3 Sections */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
              <div className="flex flex-wrap gap-2">
                {/* SECTION 1: Blog Editor (Full Width) */}
                <button
                  type="button"
                  onClick={() => setActiveTab("blogs")}
                  className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                    activeTab === "blogs"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  {selectedPost ? "Edit Blog Post" : "Create Blog Post"}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-mono font-bold ${
                      activeTab === "blogs"
                        ? "bg-black/25 text-primary-foreground"
                        : "bg-electric/15 text-electric"
                    }`}
                  >
                    Editor
                  </span>
                </button>

                {/* SECTION 2: Live Blog Showcase & Explorer */}
                <button
                  type="button"
                  onClick={() => setActiveTab("showcase")}
                  className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                    activeTab === "showcase"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  All Blogs &amp; Live Showcase
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-mono font-semibold ${
                      activeTab === "showcase"
                        ? "bg-black/25 text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {posts.length}
                  </span>
                </button>

                {/* SECTION 3: User Management */}
                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className={`inline-flex items-center gap-2.5 rounded-xl px-5 py-2.5 text-sm font-bold transition ${
                    activeTab === "users"
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  User Management
                </button>
              </div>

              {/* Quick Action in Editor Mode */}
              {activeTab === "blogs" && selectedPost && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPost(null)}
                  className="text-xs font-semibold"
                >
                  <Plus className="h-3.5 w-3.5 mr-1 text-electric" />
                  Create New Post
                </Button>
              )}
            </div>

            {/* SECTION 1: FULL WIDTH BLOG EDITOR */}
            {activeTab === "blogs" && (
              <div className="w-full">
                <PostForm
                  selectedPost={selectedPost}
                  token={token}
                  onSaved={() => {
                    loadPosts();
                    setActiveTab("showcase");
                  }}
                  onCancel={() => setSelectedPost(null)}
                />
              </div>
            )}

            {/* SECTION 2: 3RD SECTION - LIVE BLOG EXPLORER & SHOWCASE */}
            {activeTab === "showcase" && (
              <LiveBlogExplorerSection
                posts={posts}
                onEditPost={handleEditFromShowcase}
                onDuplicatePost={handleDuplicate}
                onDeletePost={handleDelete}
                actionLoadingId={actionLoadingId}
                loading={loading}
              />
            )}

            {/* SECTION 3: USER MANAGEMENT */}
            {activeTab === "users" && (
              <UserManagementSection token={token} currentAdminEmail={currentAdminEmail} />
            )}
          </>
        )}
      </section>
    </div>
  );
}
