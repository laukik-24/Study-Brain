'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { LogOut, Brain, Unplug, Menu } from 'lucide-react';
import { checkHealth } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function Navbar({ onMenuClick, isSidebarCollapsed }) {
  const router = useRouter();
  const [isBackendUp, setIsBackendUp] = useState(true);

  useEffect(() => {
    const monitorHealth = async () => {
      const isUp = await checkHealth();
      setIsBackendUp(isUp);
    };

    monitorHealth();
    const interval = setInterval(monitorHealth, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-md border-b border-white/5 py-3 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo Section - Consistent Branding */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 group cursor-default">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <Brain size={20} className="sm:hidden" />
              <Brain size={24} className="hidden sm:block" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-white leading-none tracking-tight">StudyBrain</h1>
              <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-[0.2em] mt-1 hidden md:block">AI Tutor</p>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4 sm:gap-8">
          <div className={`flex items-center gap-2 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border shadow-lg transition-all duration-500 ${
            isBackendUp 
              ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10 shadow-emerald-500/5" 
              : "text-red-500 bg-red-500/5 border-red-500/10 shadow-red-500/5"
          }`}>
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
              isBackendUp ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            }`}></div>
            <span className="tracking-wide uppercase hidden xs:inline">
              {isBackendUp ? "RAG Pipeline Active" : "RAG Disconnected"}
            </span>
            <span className="tracking-wide uppercase xs:hidden">
              {isBackendUp ? "Active" : "Offline"}
            </span>
          </div>

          <button 
            onClick={handleLogout}
            className="md:hidden flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-200 font-medium group"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
