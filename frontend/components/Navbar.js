"use client";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogOut, Brain, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-white/5 py-3 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <Brain size={20} className="sm:hidden" />
            <Brain size={24} className="hidden sm:block" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white leading-none tracking-tight">
              StudyBrain
            </h1>
            <p className="hidden sm:block text-[10px] text-zinc-500 uppercase font-bold tracking-[0.2em]">
              Private AI Tutor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8">
          {/* <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
            <span className="tracking-wide">RAG PIPELINE ACTIVE</span>
          </div> */}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-medium group">
            <span className="hidden lg:block xs:inline">Logout</span>
            <LogOut
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
