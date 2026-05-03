"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Sparkles, Shield, Zap, ArrowRight, Github } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard/chat");
      }
    }
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full"></div>
      </div>

      <nav className="max-w-[1600px] mx-auto px-8 py-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Brain size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter italic">
            StudyBrain
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="text-zinc-400 font-bold hover:text-white transition-colors">
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98]">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 pt-32 pb-40 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-4">
            <Sparkles size={14} />
            The Future of Private Learning
          </div>

          <h1 className="text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            Your notes. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
              Now with a brain.
            </span>
          </h1>

          <p className="text-xl text-zinc-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Upload your documents and let our private RAG pipeline turn them
            into a searchable neural network. No data leaks. No training. Just
            pure intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link
              href="/login"
              className="group px-10 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.3)] flex items-center gap-3">
              Start Your Private Brain
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center gap-4 px-6 text-zinc-500 font-bold border border-white/5 bg-white/5 rounded-2xl">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-[10px]">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span>Joined by 5,000+ top students</span>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="mt-56 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="text-emerald-500" />}
            title="Isolated Intelligence"
            desc="Every document is indexed into a unique vector partition. Your data is mathematically invisible to other users."
          />
          <FeatureCard
            icon={<Zap className="text-blue-500" />}
            title="Instant Retrieval"
            desc="Query 1,000s of pages in milliseconds. Our pipeline extracts exact context with 99.9% accuracy."
          />
          <FeatureCard
            icon={<Brain className="text-indigo-500" />}
            title="Neural Synthesis"
            desc="Powered by Llama 3.1 & DeepSeek. Get textbook-quality explanations directly from your curriculum."
          />
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 text-center relative z-10">
        <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase">
          © 2026 StudyBrain Systems • Built for High Performance
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-10 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/50 hover:border-white/10 transition-all group">
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
