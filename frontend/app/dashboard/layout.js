'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Navbar from '@/components/Navbar';
import { Loader2 } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    <div className="h-screen bg-black flex flex-col selection:bg-blue-500/30 overflow-hidden relative">
      {/* Top Navbar */}
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(true)} 
        isSidebarCollapsed={isSidebarCollapsed} 
      />
      
      <div className="flex-1 flex min-w-0 overflow-hidden relative">
        {/* Sidebar below Navbar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        
        <main className="flex-1 overflow-y-auto hide-scrollbar p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1400px] mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
      
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
}
