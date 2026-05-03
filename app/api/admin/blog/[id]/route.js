import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import prisma from "@/lib/prisma";
import { renderArticleContent } from "@/lib/sanitize";

async function deleteBlobIfHosted(url) {
  if (typeof url !== "string" || !url.includes(".public.blob.vercel-storage.com")) return;
  try {
    await del(url);
  } catch (err) {
    console.error("Blob cleanup failed (blog cover):", err.message);
  }
}

const MAX_TITLE = 200;
const MAX_EXCERPT = 500;
const MAX_CONTENT = 200_000;
const MAX_COVER = 2000;

function toSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(title, excludeId) {
  const base = toSlug(title);
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const data = await request.json();
    const title = typeof data.title === "string" ? data.title.trim() : "";
    const content = typeof data.content === "string" ? data.content : "";
    const excerpt = typeof data.excerpt === "string" ? data.excerpt.trim() : "";
    const coverImage =
      typeof data.coverImage === "string" && data.coverImage.trim()
        ? data.coverImage.trim()
        : null;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titlul și conținutul sunt obligatorii" },
        { status: 400 }
      );
    }
    if (
      title.length > MAX_TITLE ||
      excerpt.length > MAX_EXCERPT ||
      content.length > MAX_CONTENT ||
      (coverImage && coverImage.length > MAX_COVER)
    ) {
      return NextResponse.json({ error: "Conținut prea lung" }, { status: 400 });
    }
    if (coverImage && !/^(https?:\/\/|\/)/.test(coverImage)) {
      return NextResponse.json({ error: "URL imagine invalid" }, { status: 400 });
    }

    const slug = await uniqueSlug(title, id);

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content: renderArticleContent(content),
        coverImage,
        published: data.published === true,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const post = await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    deleteBlobIfHosted(post.coverImage).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
