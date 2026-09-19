import fs from "node:fs";
import path from "node:path";

try {
  process.loadEnvFile();
} catch {}

const API_BASE = "http://localhost:3002";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@terraxnexus.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "TerraXAdmin!2026";

async function main() {
  console.log("\n==========================================");
  console.log("🚀 STARTING FULL SYSTEM FUNCTIONALITY TESTS");
  console.log("==========================================\n");

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    process.stdout.write(`⏳ Testing: ${name}... `);
    try {
      await fn();
      console.log("✅ PASSED");
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  let token = "";

  // 1. Authentication Test
  await test("Admin Login (/api/auth/login)", async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.access_token) throw new Error("No access_token returned");
    token = data.access_token;
  });

  // 2. User Management Tests
  let testUserId = "";
  await test("User Management - Create Admin User (/api/admin/users)", async () => {
    const testEmail = `test_admin_${Date.now()}@terraxnexus.local`;
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: testEmail, password: "password123" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.id || data.email !== testEmail) throw new Error("Invalid user response");
    testUserId = data.id;
  });

  await test("User Management - List Users (/api/admin/users)", async () => {
    const res = await fetch(`${API_BASE}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const list = await res.json();
    if (!Array.isArray(list) || list.length < 2) throw new Error("Expected at least 2 users");
  });

  await test("User Management - Update User Password (/api/admin/users/:id)", async () => {
    const res = await fetch(`${API_BASE}/api/admin/users/${testUserId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: "newpassword123" }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  await test("User Management - Delete User (/api/admin/users/:id)", async () => {
    const res = await fetch(`${API_BASE}/api/admin/users/${testUserId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 3. Image Upload Test
  let uploadedImageUrl = "";
  await test("Image Upload (/api/admin/uploads/blog-images)", async () => {
    const form = new FormData();
    const fakeImageBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    const blob = new Blob([fakeImageBuffer], { type: "image/png" });
    form.append("image", blob, "test-cover.png");

    const res = await fetch(`${API_BASE}/api/admin/uploads/blog-images`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.url) throw new Error("No URL returned from upload");
    uploadedImageUrl = data.url;
  });

  // 4. Adwin Post Creation with All Fields (Tags, SEO, Direct HTML, Mobile Image)
  let createdPostId = "";
  const testSlug = `autonomous-excavator-test-${Date.now()}`;
  await test("Post Management - Create Post with Adwin Fields & Direct HTML", async () => {
    const postPayload = {
      title: "Next-Gen Autonomous Excavators In Field Operations",
      slug: testSlug,
      excerpt: "Comprehensive report on AI-powered heavy machinery and autonomous site management.",
      content: `
## Autonomous Operations Overview
Autonomous heavy machinery is revolutionizing modern infrastructure.

<div class="my-6 rounded-xl border border-electric/40 bg-card p-5 shadow-soft">
  <h4 class="text-lg font-bold text-electric">⚡ Highlight Features</h4>
  <p class="mt-2 text-muted-foreground">Direct raw HTML rendering with real-time sensor analytics.</p>
</div>

<div class="overflow-x-auto my-6">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="bg-card border-b border-border">
        <th class="p-3 text-left">Feature</th>
        <th class="p-3 text-left">Specification</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-border">
        <td class="p-3">Battery Capacity</td>
        <td class="p-3">150 kWh Solid-State</td>
      </tr>
      <tr class="border-b border-border">
        <td class="p-3">Autonomous Level</td>
        <td class="p-3">Level 4 Certified</td>
      </tr>
    </tbody>
  </table>
</div>
      `.trim(),
      cover_image_url: uploadedImageUrl,
      mobile_image_url: uploadedImageUrl,
      post_date: "2026-09-19",
      read_time: "4 min read",
      author_name: "Vikash",
      author_role: "Lead Robotics Architect",
      author_bio: "Specialist in heavy autonomous machinery and battery technology.",
      author_avatar_url: uploadedImageUrl,
      author_social_url: "https://linkedin.com/in/vikash",
      category: "Excavators",
      status: "published",
      tags: ["Robotics", "Autonomous", "Excavators", "AI"],
      og_image_url: uploadedImageUrl,
      meta_title: "Next-Gen Autonomous Excavators | TERRA-X Fleet",
      meta_description: "Explore the latest in autonomous excavators and Level 4 site robotics.",
      meta_keywords: "autonomous excavator, heavy machinery, ai construction",
      canonical_url: `https://terraxopc.com/blog/${testSlug}`,
      no_index: false,
      head_scripts: "<meta name='custom-test' content='true'>",
      body_scripts: "<!-- Tracking pixel test -->",
      schema_markup: '{"@context":"https://schema.org","@type":"TechArticle"}',
    };

    const res = await fetch(`${API_BASE}/api/admin/blog-posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postPayload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const post = await res.json();
    if (!post.id || post.slug !== testSlug) throw new Error("Invalid post created");
    if (!Array.isArray(post.tags) || post.tags.length !== 4) throw new Error("Tags were not saved properly");
    if (post.category !== "Excavators") throw new Error("Category mismatch");
    if (post.author_role !== "Lead Robotics Architect") throw new Error("Author role mismatch");
    if (post.author_bio !== "Specialist in heavy autonomous machinery and battery technology.") throw new Error("Author bio mismatch");
    if (post.author_avatar_url !== uploadedImageUrl) throw new Error("Author avatar mismatch");
    if (post.author_social_url !== "https://linkedin.com/in/vikash") throw new Error("Author social link mismatch");
    createdPostId = post.id;
  });

  // 5. Fetch Published Post by Slug (Public Route)
  await test("Public Blog - Fetch Published Post by Slug (/api/blog-posts/:slug)", async () => {
    const res = await fetch(`${API_BASE}/api/blog-posts/${testSlug}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const post = await res.json();
    if (!post || post.slug !== testSlug) throw new Error("Could not find published post");
    if (!post.content.includes("Solid-State")) throw new Error("Content table not found");
    if (post.author_name !== "Vikash") throw new Error("Author name not returned");
    if (post.author_role !== "Lead Robotics Architect") throw new Error("Author role not returned");
  });

  // 6. Update Post
  await test("Post Management - Update Post (/api/admin/blog-posts/:id)", async () => {
    const res = await fetch(`${API_BASE}/api/admin/blog-posts/${createdPostId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Next-Gen Autonomous Excavators (Updated)",
        slug: testSlug,
        excerpt: "Updated summary text for autonomous excavators.",
        content: "## Updated Content Body\n\nNew paragraph content.",
        author_name: "Vikash",
        author_role: "Chief Robotics Architect",
        author_bio: "Updated author bio description.",
        author_avatar_url: uploadedImageUrl,
        author_social_url: "https://linkedin.com/in/vikash",
        category: "Robotics & AI",
        status: "published",
        tags: ["Robotics", "AI", "Updated"],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updated = await res.json();
    if (updated.title !== "Next-Gen Autonomous Excavators (Updated)") throw new Error("Title update failed");
    if (updated.category !== "Robotics & AI") throw new Error("Category update failed");
  });

  // 7. Duplicate Post Test (Adwin duplicate functionality)
  let duplicatedPostId = "";
  await test("Post Management - Duplicate Post (/api/admin/blog-posts/:id/duplicate)", async () => {
    const res = await fetch(`${API_BASE}/api/admin/blog-posts/${createdPostId}/duplicate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dup = await res.json();
    if (!dup.slug.endsWith("-copy")) throw new Error(`Duplicated slug does not end with -copy: ${dup.slug}`);
    if (dup.status !== "draft") throw new Error(`Duplicated post should be draft, got ${dup.status}`);
    duplicatedPostId = dup.id;
  });

  // 8. Delete Posts Cleanup
  await test("Post Management - Delete Posts (/api/admin/blog-posts/:id)", async () => {
    const res1 = await fetch(`${API_BASE}/api/admin/blog-posts/${createdPostId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res1.ok) throw new Error(`Failed to delete original post: HTTP ${res1.status}`);

    const res2 = await fetch(`${API_BASE}/api/admin/blog-posts/${duplicatedPostId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res2.ok) throw new Error(`Failed to delete duplicate post: HTTP ${res2.status}`);
  });

  console.log("\n==========================================");
  console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================\n");

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
