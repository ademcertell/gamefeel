import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "GameFeel Atlas",
  description: "Interactive game feel laboratory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isEmbed =
    typeof window !== "undefined" &&
    window.location.search.includes("embed=true");

  return (
    <html lang="en">
      <body className="bg-[#0d0d0d] text-gray-100 min-h-screen flex flex-col">
        <header className="w-full border-b border-gray-800 bg-[#111]">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2"
            >
              🎮 <span>GameFeel</span>
            </Link>
            <nav className="flex gap-8 text-gray-300">
              <Link
                href="/labs/camera"
                className="hover:text-blue-400 transition"
              >
                Camera Lab
              </Link>
              <Link href="/compare" className="hover:text-blue-400 transition">
                Compare
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 max-w-6xl mx-auto w-full p-6">{children}</main>
      </body>
    </html>
  );
}