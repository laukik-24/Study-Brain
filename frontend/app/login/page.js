'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Brain, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard/chat");
      }
    }
    checkUser();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard/chat`
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-full h-[50vh] bg-gradient-to-t from-blue-900/10 to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-zinc-900/50 backdrop-blur-2xl p-12 rounded-[2.5rem] border border-white/10 shadow-2xl text-center relative z-10 mx-4"
      >
        <div className="mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] mx-auto mb-6 transform -rotate-6">
            <Brain size={42} />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2 italic">StudyBrain</h2>
          <p className="text-zinc-500 font-medium">Activate your private neural study brain.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest rounded-2xl border border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] disabled:opacity-50 group"
          >
            {loading ? (
              <Loader2 size={24} className="animate-spin text-zinc-900" />
            ) : (
              <>
                <div className="bg-white p-1 rounded-md">
                  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.78 1.85-1.63 2.42v2.01h2.64c1.55-1.42 2.43-3.52 2.43-5.54z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-2.64-2.01c-.73.48-1.67.76-2.64.76-2.85 0-5.27-1.92-6.13-4.51H5.17v2.13A8.992 8.992 0 0 0 12 23z" fill="#34A853"/>
                    <path d="M5.87 14.58c-.22-.66-.35-1.36-.35-2.08s.13-1.42.35-2.08V8.29H5.17C4.42 9.77 4 11.44 4 13.21s.42 3.44 1.17 4.92l2.7-2.12c-.13-.43-.2-.89-.2-1.43z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                Continue with Google
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] pt-4">
            Secured by Supabase Identity
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-xs text-zinc-500 leading-relaxed px-6">
            By logging in, you grant access to our RAG pipeline to process your study documents securely.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Loader2({ className, size }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
