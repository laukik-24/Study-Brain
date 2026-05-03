'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';
import { FileText, Calendar, Tag, ShieldCheck, Loader2, Search, Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchDocs() {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error) setDocuments(data || []);
      setLoading(false);
    }
    fetchDocs();
  }, []);

  const filteredDocs = documents.filter(doc => 
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 pb-10 sm:pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6 sm:pb-8">
        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight italic">Library</h2>
          <p className="text-zinc-500 text-sm sm:text-lg font-medium mt-1 sm:mt-2">Manage your neural knowledge base.</p>
        </div>
        
        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-white placeholder:text-zinc-700 text-sm sm:text-base"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 sm:py-32 space-y-4">
          <Loader2 className="animate-spin text-blue-500" size={32} />
          <p className="text-zinc-500 font-medium text-sm sm:text-base">Scanning library...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900/30 border border-dashed border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] p-12 sm:p-24 text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-900 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl border border-white/5">
            <FileText size={28} className="text-zinc-700 sm:hidden" />
            <FileText className="text-zinc-700 hidden sm:block" size={32} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No data found</h3>
          <p className="text-zinc-500 text-xs sm:text-sm mb-6 sm:mb-8 max-w-xs mx-auto">Upload your first PDF to begin building your private brain.</p>
          <a href="/dashboard/upload" className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] text-sm sm:text-base">
            Upload PDF
          </a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <AnimatePresence>
            {filteredDocs.map((doc, i) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Status Glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>

                <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:text-blue-300 transition-all shadow-inner border border-white/5 flex-shrink-0">
                    <FileText size={20} className="sm:hidden" />
                    <FileText size={24} className="hidden sm:block" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate pr-8 text-sm sm:text-base" title={doc.filename}>{doc.filename}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2 sm:mt-3">
                      <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        <Tag size={10} className="text-blue-500/50 sm:scale-110" />
                        {doc.doc_type}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        <Calendar size={10} className="text-zinc-600 sm:scale-110" />
                        {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 sm:py-1 rounded-full border",
                        doc.status === 'indexed' ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/10" :
                        doc.status === 'processing' ? "text-amber-500 bg-amber-500/5 border-amber-500/10" :
                        "text-red-500 bg-red-500/5 border-red-500/10"
                      )}>
                        {doc.status === 'indexed' ? <ShieldCheck size={10} /> : 
                         doc.status === 'processing' ? <Loader2 size={10} className="animate-spin" /> : 
                         <AlertCircle size={10} />}
                        {doc.status}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <Trash2 size={16} className="sm:hidden" />
                  <Trash2 size={18} className="hidden sm:block" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
