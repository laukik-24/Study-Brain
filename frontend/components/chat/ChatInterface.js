"use client";
import { useState, useEffect, useRef } from "react";
import { askQuestion } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Command,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchChatHistory() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data.map((m) => ({ role: m.role, text: m.content })));
      }
      setInitialLoading(false);
    }
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const suggestions = [
    { icon: <Sparkles size={14} />, text: "Summarize notes" },
    { icon: <Command size={14} />, text: "Java flashcards" },
    { icon: <Bot size={14} />, text: "Weak areas?" },
  ];

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const text = textOverride || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await askQuestion(text);
      setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Error: Connection lost with StudyBrain." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[75vh] space-y-4">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <p className="text-zinc-500 font-medium text-sm animate-pulse">
          Syncing history...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-900/30 backdrop-blur-md rounded-3xl sm:rounded-2xl border border-white/5 shadow-2xl overflow-hidden relative mb-4 sm:mb-6">
      {/* Messages Area - Scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 sm:space-y-10 scroll-smooth hide-scrollbar">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-10 sm:py-20 text-center space-y-4 sm:space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-[1.25rem] sm:rounded-[2rem] flex items-center justify-center text-blue-500 shadow-inner">
                <Brain size={32} className="sm:hidden" />
                <Brain size={40} className="hidden sm:block" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Neural Knowledge Base
                </h3>
                <p className="text-zinc-500 text-sm sm:text-base max-w-[250px] sm:max-w-sm mx-auto mt-2 font-medium">
                  Ask questions and I&apos;ll answer using only your uploaded
                  materials.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-start gap-3 sm:gap-6 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}>
              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-[1.25rem] flex items-center justify-center flex-shrink-0 shadow-2xl transition-transform hover:scale-110 ${
                  msg.role === "user"
                    ? "bg-zinc-800 border border-white/10"
                    : "bg-gradient-to-br from-blue-600 to-indigo-700"
                }`}>
                {msg.role === "user" ? (
                  <User size={18} className="text-zinc-400 sm:hidden" />
                ) : (
                  <Bot size={18} className="text-white sm:hidden" />
                )}
                {msg.role === "user" ? (
                  <User size={24} className="text-zinc-400 hidden sm:block" />
                ) : (
                  <Bot size={24} className="text-white hidden sm:block" />
                )}
              </div>

              <div
                className={`group relative max-w-[85%] p-4 sm:p-7 rounded-[1.25rem] sm:rounded-[2rem] transition-all duration-300 ${
                  msg.role === "user"
                    ? "bg-blue-600/10 text-white rounded-tr-none border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.05)]"
                    : "bg-zinc-800/40 text-white rounded-tl-none border border-white/5 shadow-2xl backdrop-blur-sm"
                }`}>
                <div className="markdown-content text-sm sm:text-[16px] leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
                <div
                  className={`absolute -bottom-5 sm:-bottom-6 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap ${
                    msg.role === "user"
                      ? "right-2 text-blue-500"
                      : "left-2 text-zinc-500"
                  }`}>
                  {msg.role === "user" ? "Student" : "Study Brain"}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 sm:gap-3 ml-12 sm:ml-18">
            <div className="flex gap-1">
              <span
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}></span>
              <span
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}></span>
              <span
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}></span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-zinc-600 uppercase tracking-widest">
              Consulting notes
            </span>
          </motion.div>
        )}
      </div>

      {/* Input Area - Sticky at bottom */}
      <div className="sticky bottom-0 p-4 sm:p-8 pt-2 sm:pt-4 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/5 z-20">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(null, s.text)}
                className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold px-3 sm:px-5 py-1.5 sm:py-2.5 bg-zinc-900/50 text-zinc-400 rounded-full border border-white/5 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm active:scale-95">
                <span className="scale-75 sm:scale-100">{s.icon}</span>
                {s.text}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-[1rem] sm:rounded-[2rem] blur-xl opacity-20 group-focus-within:opacity-40 transition duration-700"></div>
            <div className="relative flex items-center bg-zinc-900/80 backdrop-blur-md rounded-[1rem] sm:rounded-[1.5rem] border border-white/10 pr-2 sm:pr-3 shadow-2xl">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your brain..."
                className="w-full pl-4 sm:pl-8 pr-16 sm:pr-20 py-4 sm:py-6 bg-transparent border-none focus:ring-0 text-white text-sm sm:text-base font-medium placeholder:text-zinc-500 rounded-[1rem] sm:rounded-[1.5rem]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3.5 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-500 transition-all disabled:opacity-30 disabled:grayscale hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-95 group/btn">
                <span className="font-bold text-xs sm:text-sm hidden xs:inline">
                  Send
                </span>
                <Send
                  size={16}
                  className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform"
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
