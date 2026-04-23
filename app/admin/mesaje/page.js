import prisma from "@/lib/prisma";
import MarkReadButton from "./MarkReadButton";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  let messages = [];
  try {
    messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-stone-900">
          Mesaje de contact
        </h1>
        <p className="mt-0.5 text-sm text-stone-500">
          {messages.length} mesaje total ·{" "}
          <span className={unread > 0 ? "font-semibold text-gold-600" : ""}>
            {unread} necitite
          </span>
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20 text-center">
          <p className="text-stone-400">
            Nu există mesaje încă. Ele vor apărea aici când cineva completează
            formularul de contact.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl bg-white p-6 shadow-sm ring-1 transition-all ${
                m.read ? "ring-stone-100" : "ring-gold-300"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    {!m.read && (
                      <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                    )}
                    <span className="font-semibold text-stone-900">
                      {m.name}
                    </span>
                    <a
                      href={`tel:${m.phone}`}
                      className="rounded-full bg-gold-50 px-3 py-0.5 text-sm font-medium text-gold-700 hover:bg-gold-100"
                    >
                      {m.phone}
                    </a>
                    {!m.read && (
                      <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
                        Nou
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {m.message}
                  </p>
                  <p className="mt-3 text-xs text-stone-400">
                    {new Date(m.createdAt).toLocaleString("ro-RO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!m.read && <MarkReadButton messageId={m.id} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
