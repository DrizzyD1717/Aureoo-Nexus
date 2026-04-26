"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-obsidian flex flex-col relative overflow-hidden text-silver-light">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-silver-glow opacity-30 pointer-events-none" />

      {/* Minimal Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 h-20 flex items-center justify-between">
        <div className="text-xl font-light tracking-tight">
          Aureoo <span className="font-semibold text-silver">Nexus</span>
        </div>
        <Link
          href="/login"
          className="text-sm font-medium text-silver hover:text-silver-light transition-colors"
        >
          Client Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-200 border border-obsidian-300 text-xs font-medium text-silver-dark mb-4">
            <Sparkles className="w-3 h-3 text-silver" />
            <span>Exclusive Client Portal</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
            Where creative vision meets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-silver-light to-silver-dark font-semibold">
              precision.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-silver-dark max-w-2xl mx-auto font-light">
            A dedicated, secure workspace for our partners to track project
            milestones, collaborate seamlessly, and access finalized digital
            assets.
          </p>

          <div className="pt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-silver text-obsidian px-8 py-4 rounded-xl font-medium hover:bg-silver-light transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(192,192,192,0.3)]"
            >
              <span>Enter Portal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Bento-style Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-32 pb-20"
        >
          <div className="relative p-[1px] rounded-2xl bg-silver-gradient">
            <div className="bg-obsidian-100/80 backdrop-blur-sm rounded-2xl p-8 h-full border border-obsidian-300 flex flex-col items-center text-center">
              <div className="p-3 bg-obsidian-200 rounded-xl mb-4">
                <Zap className="w-6 h-6 text-silver" />
              </div>
              <h3 className="font-medium mb-2">Live Progress</h3>
              <p className="text-sm text-silver-dark">
                Watch your ideas come to life with real-time kanban tracking
                across every phase of development.
              </p>
            </div>
          </div>

          <div className="relative p-[1px] rounded-2xl bg-silver-gradient md:-translate-y-4">
            <div className="bg-obsidian-100/80 backdrop-blur-sm rounded-2xl p-8 h-full border border-obsidian-300 flex flex-col items-center text-center shadow-2xl shadow-black/50">
              <div className="p-3 bg-obsidian-200 rounded-xl mb-4">
                <Shield className="w-6 h-6 text-silver" />
              </div>
              <h3 className="font-medium mb-2">Secure Vault</h3>
              <p className="text-sm text-silver-dark">
                Your brand assets and deliverables are encrypted and isolated,
                accessible only by you.
              </p>
            </div>
          </div>

          <div className="relative p-[1px] rounded-2xl bg-silver-gradient">
            <div className="bg-obsidian-100/80 backdrop-blur-sm rounded-2xl p-8 h-full border border-obsidian-300 flex flex-col items-center text-center">
              <div className="p-3 bg-obsidian-200 rounded-xl mb-4">
                <Sparkles className="w-6 h-6 text-silver" />
              </div>
              <h3 className="font-medium mb-2">Refined Aesthetic</h3>
              <p className="text-sm text-silver-dark">
                An interface engineered to reflect the same high standards we
                apply to your creative work.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
