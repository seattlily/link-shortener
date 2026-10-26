import { HydrateClient } from "~/trpc/server";
import { LinkShortener } from "~/app/_components/link-shortener";

export default function Home() {
  return (
    <HydrateClient>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-violet-50">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative z-10 container flex flex-col items-center gap-10 px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-800 sm:text-6xl">
              Link{" "}
              <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                Shortener
              </span>
            </h1>
            <p className="mt-4 text-gray-500">
              Paste a long URL and get something cute back.
            </p>
          </div>

          <LinkShortener />
        </div>
      </main>
    </HydrateClient>
  );
}
