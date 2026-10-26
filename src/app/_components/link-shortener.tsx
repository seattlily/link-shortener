"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function LinkShortener() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const utils = api.useUtils();
  const links = api.link.getAll.useQuery();

  const create = api.link.create.useMutation({
    onSuccess: async () => {
      setUrl("");
      await utils.link.getAll.invalidate();
    },
  });

  const origin =
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  function shortUrl(slug: string) {
    return `${origin}/${slug}`;
  }

  async function copyToClipboard(slug: string) {
    await navigator.clipboard.writeText(shortUrl(slug));
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url) return;
    create.mutate({ url });
  }

  return (
    <div className="w-full max-w-xl space-y-5">
      {/* card */}
      <div className="rounded-3xl border border-rose-100 bg-white/70 p-6 shadow-xl shadow-rose-100/50 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="flex-1 rounded-xl border border-rose-200 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
          />
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-md shadow-pink-200 transition hover:from-pink-400 hover:to-rose-400 hover:shadow-pink-300 disabled:opacity-50"
          >
            {create.isPending ? "..." : "Shorten"}
          </button>
        </form>

        {create.error && (
          <p className="mt-3 text-sm text-rose-400">{create.error.message}</p>
        )}
      </div>

      {/* links list */}
      {links.data && links.data.length > 0 && (
        <ul className="space-y-3">
          {links.data.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-rose-100 bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm transition hover:shadow-md hover:shadow-rose-100/50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-gray-400">{link.url}</p>
                <a
                  href={shortUrl(link.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-pink-500 hover:text-pink-400 hover:underline"
                >
                  {shortUrl(link.slug)}
                </a>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                  {link.clicks} clicks
                </span>
                <button
                  onClick={() => copyToClipboard(link.slug)}
                  className="rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-100"
                >
                  {copied === link.slug ? "Copied!" : "Copy"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
