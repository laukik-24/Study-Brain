'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocument } from '@/lib/api';
import { Upload, FileText, CheckCircle2, AlertCircle, Zap, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('Notes');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !docName) return;

    setLoading(true);
    setMessage(null);
    try {
      await uploadDocument(file, docName, docType);
      setMessage({ type: 'success', text: 'Upload successful! Redirecting to library...' });

      // Give the user a moment to see the success message before redirecting
      setTimeout(() => {
        router.push('/dashboard/documents');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload document. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 pb-10 sm:pb-20">
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight italic">Expand Your Brain</h2>
        <p className="text-zinc-500 text-sm sm:text-lg max-w-2xl text-balance font-medium">
          Upload PDFs and our RAG pipeline will break them down into searchable neural chunks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Main Upload Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-zinc-900/50 backdrop-blur-sm p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl space-y-6"
        >
          <form onSubmit={handleUpload} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Document Name</label>
                <input 
                  type="text" 
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Physics Notes"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-zinc-950/50 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-white placeholder:text-zinc-700 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Category</label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-zinc-950/50 border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-white appearance-none cursor-pointer text-sm sm:text-base"
                >
                  <option>Notes</option>
                  <option>Book</option>
                  <option>PYQ</option>
                </select>
              </div>
            </div>

            <div className="group relative">
              <input 
                type="file" 
                accept=".pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);
                  if (selectedFile && !docName) {
                    setDocName(selectedFile.name.replace(/\.pdf$/i, ''));
                  }
                }}
                className="hidden" 
                id="file-upload"
              />
              <label 
                htmlFor="file-upload" 
                className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[1.5rem] sm:rounded-[2rem] p-8 sm:p-12 text-center hover:bg-white/[0.02] hover:border-blue-500/30 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-500 mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={28} className="sm:hidden" />
                  <Upload size={32} className="hidden sm:block" />
                </div>
                <div className="text-white font-bold text-base sm:text-lg mb-1 truncate max-w-xs px-4">
                  {file ? file.name : "Drop PDF here"}
                </div>
                <div className="text-[10px] sm:text-sm text-zinc-500">Max size 10MB • PDF only</div>
              </label>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={loading || !file}
              className="w-full py-4 sm:py-5 bg-blue-600 text-white font-black text-base sm:text-lg rounded-xl sm:rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-30 shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Indexing...
                </>
              ) : "Upload & Sync"}
            </button>
          </form>
        </motion.div>

        {/* Sidebar Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-tighter">
              <Zap size={14} className="sm:scale-110" />
              <span>Smart Indexing</span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 leading-relaxed">
              AI automatically chunks your document to preserve paragraph context.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-zinc-900/50 border border-white/5 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs sm:text-sm uppercase tracking-tighter">
              <Shield size={14} className="sm:scale-110" />
              <span>Private</span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed">
              Your data is stored in an isolated, encrypted vector partition.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-zinc-900/50 border border-white/5 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs sm:text-sm uppercase tracking-tighter">
              <FileText size={14} className="sm:scale-110" />
              <span>Best Results</span>
            </div>
            <ul className="text-[9px] sm:text-[11px] text-zinc-500 space-y-1 list-disc ml-3">
              <li>Text-based PDFs only</li>
              <li>Clear sections</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
