'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Upload, Library, LogOut, X, ChevronLeft, ChevronRight, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:relative inset-y-0 left-0 bg-zinc-950/90 md:bg-zinc-950/50 backdrop-blur-2xl border-r border-white/5 h-full flex-shrink-0 z-[70] transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        isCollapsed ? "w-72 md:w-20" : "w-72"
      )}>
        {/* Mobile Header & Desktop Collapse Toggle */}
        <div className={cn(
          "p-4 border-b border-white/5 flex items-center md:border-none",
          isCollapsed ? "md:justify-center justify-between" : "justify-between"
        )}>
          {/* Mobile Only Logo */}
          <div className="md:hidden flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Brain size={20} />
            </div>
            <h1 className="text-xl font-black text-white leading-none tracking-tight">StudyBrain</h1>
          </div>
          
          <button 
            className="md:hidden p-2 text-zinc-500 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={24} />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            className="hidden md:flex absolute -right-3 top-10 w-6 h-6 bg-blue-600 rounded-full items-center justify-center text-white border border-white/10 shadow-lg hover:bg-blue-500 transition-all z-50"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto hide-scrollbar">
          <p className={cn("text-[10px] text-zinc-600 uppercase font-black tracking-[0.2em] px-4 mb-4", isCollapsed && "md:hidden")}>
            Navigation
          </p>
          <SidebarLink href="/dashboard/chat" label="Study Chat" icon={<MessageSquare size={20} />} active={pathname === '/dashboard/chat'} onClick={() => setIsOpen(false)} isCollapsed={isCollapsed} />
          <SidebarLink href="/dashboard/upload" label="Sync Brain" icon={<Upload size={20} />} active={pathname === '/dashboard/upload'} onClick={() => setIsOpen(false)} isCollapsed={isCollapsed} />
          <SidebarLink href="/dashboard/documents" label="Library" icon={<Library size={20} />} active={pathname === '/dashboard/documents'} onClick={() => setIsOpen(false)} isCollapsed={isCollapsed} />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300 group",
              isCollapsed && "md:justify-center md:px-0"
            )}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform flex-shrink-0" />
            <span className={cn("transition-opacity duration-300", isCollapsed && "md:hidden")}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({ href, label, icon, active, onClick, isCollapsed }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3.5 text-sm font-bold transition-all duration-300 rounded-xl group",
        active 
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5",
        isCollapsed && "md:justify-center md:px-0"
      )}
      title={isCollapsed ? label : ""}
    >
      <span className={cn("transition-transform duration-300 group-hover:scale-110 flex-shrink-0", active && "scale-110")}>
        {icon}
      </span>
      <span className={cn("whitespace-nowrap transition-opacity duration-300", isCollapsed && "md:hidden")}>{label}</span>
      {active && (
        <div className={cn("ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]", isCollapsed && "md:hidden")}></div>
      )}
    </Link>
  );
}
