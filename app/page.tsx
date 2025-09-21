"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Home() {
  const discordInvite = "https://discord.gg/vHZVGRAm3P";

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg">
          🎮 GameFeel Atlas
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Measure and <span className="text-blue-300 font-semibold">feel</span>{" "}
          design parameters directly in your browser. Tweak camera movement, aim
          assist, recoil patterns and more.
        </p>
        <Link
          href="/labs/camera"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold shadow-lg transition"
        >
          Launch Camera Lab
        </Link>
      </section>
      <section className="grid md:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-gray-700 bg-white/5 backdrop-blur p-6 hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold text-blue-400 mb-3">Labs</h2>
          <p className="text-gray-400 mb-4">
            Play with interactive demos and tweak parameters in real time.
          </p>
          <ul className="space-y-2">
            <li>
              <Link
                href="/labs/camera"
                className="text-blue-300 hover:underline"
              >
                ➤ Camera Follow (Easing & Lag)
              </Link>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-700 bg-white/5 backdrop-blur p-6 hover:border-green-500 transition">
          <h2 className="text-2xl font-bold text-green-400 mb-3">Compare</h2>
          <p className="text-gray-400 mb-4">
            Load two presets side by side and directly feel the difference.
          </p>
          <Link
            href="/compare"
            className="inline-block px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white shadow"
          >
            Open Compare Mode
          </Link>
        </div>
      </section>
      <footer className="text-center mt-12 space-y-2">
        <p className="text-gray-400">Join our Discord Community</p>
        <a
          href={discordInvite}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] rounded-lg text-white transition"
        >
          <ExternalLink className="w-4 h-4" />
          Join Discord
        </a>
      </footer>
    </div>
  );
}