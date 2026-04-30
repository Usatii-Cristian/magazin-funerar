import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import BlogForm from "../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return <BlogForm post={post} />;
}
