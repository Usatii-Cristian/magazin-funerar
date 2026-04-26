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
  const undelivered = messages.filter((m) => !m.delivered).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-stone-900 sm:text-2xl">
          Mesaje de contact
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {messages.length} total ·{" "}
          <span className={unread > 0 ? "font-semibold text-gold-600" : ""}>
            {unread} necitite
          </span>
          {" · "}
          <span className={undelivered > 0 ? "font-semibold text-amber-600" : "text-stone-400"}>
            {undelivered} nelivrate
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
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-xl bg-white p-4 shadow-sm ring-1 transition-all sm:p-6 ${
                !m.read ? "ring-gold-300" : "ring-stone-100"
              }`}
            >
              {/* Top row: dot + name + phone + unread badge */}
              <div className="flex flex-wrap items-center gap-2">
                {!m.read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                )}
                <span className="font-semibold text-stone-900">{m.name}</span>
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

              {/* Status badges row */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.delivered ? (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    ✓ Livrat
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                    Nelivrat
                  </span>
                )}
                {m.telegramSent ? (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 1 0 23.888 12 12 12 0 0 0 11.944 0Zm5.305 8.342-1.77 8.351c-.133.63-.49.783-.993.487l-2.75-2.026-1.327 1.277c-.146.146-.27.268-.554.268l.196-2.797 5.109-4.612c.222-.196-.048-.305-.344-.11L7.7 13.988l-2.7-.845c-.587-.183-.6-.587.123-.87l10.535-4.062c.49-.18.918.11.591 1.131Z" />
                    </svg>
                    Telegram
                  </span>
                ) : (
                  <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-400">
                    Telegram ✗
                  </span>
                )}
              </div>

              {/* Message text */}
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {m.message}
              </p>

              {/* Footer: timestamp + actions */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-50 pt-3">
                <p className="text-xs text-stone-400">
                  {new Date(m.createdAt).toLocaleString("ro-RO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Europe/Bucharest",
                  })}
                </p>
                <MarkReadButton
                  messageId={m.id}
                  isRead={m.read}
                  isDelivered={m.delivered}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
