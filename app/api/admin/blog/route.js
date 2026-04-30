import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: "Titlul și conținutul sunt obligatorii" },
        { status: 400 }
      );
    }

    const slug = await uniqueSlug(data.title, null);

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || "",
        content: data.content,
        coverImage: data.coverImage || null,
        published: data.published ?? false,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
