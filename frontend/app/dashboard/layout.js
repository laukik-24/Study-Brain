'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { MessageSquare, Upload, Library, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs animate-pulse">
          Verifying Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col selection:bg-blue-500/30 overflow-hidden">
      <Navbar />
      
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col px-4 sm:px-6 md:px-10 overflow-hidden">
        {/* Sticky Navigation Tabs */}
        <div className="flex-shrink-0 z-40 bg-black py-4 sm:py-6 border-b border-white/5 mb-4 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-2 bg-zinc-900/50 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-white/5 w-full sm:w-fit shadow-xl">
            <TabLink href="/dashboard/chat" label="Study Chat" icon={<MessageSquare size={18} />} />
            <TabLink href="/dashboard/upload" label="Sync Brain" icon={<Upload size={18} />} />
            <TabLink href="/dashboard/documents" label="Library" icon={<Library size={18} />} />
          </div>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}

function TabLink({ href, label, icon }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={cn(
        "flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-4 sm:px-8 py-3 sm:py-3.5 text-sm font-bold transition-all duration-300 rounded-lg sm:rounded-xl",
        isActive 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-[1.02]" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
      )}
    >
      <span className={cn("transition-transform duration-300", isActive && "scale-110")}>{icon}</span>
      <span className="hidden sm:inline whitespace-nowrap">{label}</span>
    </Link>
  );
}
