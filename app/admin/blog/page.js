import Link from "next/link";
import prisma from "@/lib/prisma";
import DeleteBlogButton from "./DeleteBlogButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  let posts = [];
  let dbError = null;

  try {
    posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    dbError = err.message;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-stone-900 sm:text-2xl">
            Blog
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {posts.length} articole în baza de date
          </p>
        </div>
        <Link
          href="/admin/blog/nou"
          className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-stone-800"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="hidden sm:inline">Articol nou</span>
          <span className="sm:hidden">Nou</span>
        </Link>
      </div>

      {dbError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Eroare baza de date:</p>
          <p className="mt-1 font-mono text-xs">{dbError}</p>
        </div>
      )}

      {posts.length === 0 && !dbError ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20 text-center">
          <p className="mb-4 text-stone-500">Nu există articole de blog.</p>
          <Link
            href="/admin/blog/nou"
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Scrie primul articol
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">Titlu</th>
                <th className="hidden px-4 py-3 sm:table-cell">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 sm:table-cell">Dată</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {posts.map((post) => (
                <tr key={post.id} className="group hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-900 line-clamp-1">{post.title}</p>
                    <p className="mt-0.5 text-xs text-stone-400 line-clamp-1">{post.excerpt}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="font-mono text-xs text-stone-400">{post.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-500"
                    }`}>
                      {post.published ? "Publicat" : "Nepublicat"}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-stone-400 sm:table-cell">
                    {new Date(post.createdAt).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-200"
                      >
                        Editează
                      </Link>
                      <DeleteBlogButton postId={post.id} postTitle={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
