"use client";

import React, { useState } from "react";
import { GameCanvas } from "@/components/GameCanvas";
import { getContributionsAction } from "@/app/actions";
import { ContributionData } from "@/lib/github";
import { Rocket, Github, Copy, Check, Terminal, Sparkles } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<ContributionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsLoading(true);
    setError("");
    setData(null);

    try {
      const result = await getContributionsAction(username);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  const copyMarkdown = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const timestamp = Date.now();
    const markdown = `[![Contribution Blast](${baseUrl}/api/v1/visualize/${username}?t=${timestamp})](${baseUrl})`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans selection:bg-neon-purple selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-3 group">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-all duration-300 border border-white/5">
              <Rocket className="w-8 h-8 text-[#58a6ff]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-linear-to-r from-[#58a6ff] to-[#3fb950] bg-clip-text text-transparent">
                Contribution Blast
              </h1>
              <p className="text-white/40 text-sm font-mono tracking-widest uppercase">
                GitHub Activity Visualizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-white/60 font-mono">
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-green-500" /> STABLE
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                Turn your commits into a <span className="text-[#3fb950] tracking-wide">GALACTIC MISSION.</span>
              </h2>
              <p className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed">
                Visualize your GitHub contribution history as a classic horizontal shooter.
                Showcase your coding consistency on your profile with a clean, GitHub-styled widget.
              </p>
            </div>

            {/* Input form */}
            <form onSubmit={handleFetch} className="relative max-w-md group">
              <div className="absolute inset-0 bg-linear-to-r from-[#58a6ff] to-[#3fb950] rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition-opacity duration-500" />
              <div className="relative flex items-center p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <Github className="ml-3 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Enter GitHub username..."
                  className="w-full bg-transparent px-4 py-3 outline-none placeholder:text-white/20 font-mono"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={isLoading || !username}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#58a6ff] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
                >
                  {isLoading ? "LAUNCHING..." : "FETCH DATA"}
                </button>
              </div>
              {error && <p className="mt-3 text-red-500 text-sm flex items-center gap-2"><Terminal className="w-4 h-4" /> {error}</p>}
            </form>
          </div>

          {/* Preview Area */}
          <div className="relative aspect-video w-full perspective-1000">
            {data ? (
              <div className="animate-in zoom-in fade-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-white/40 text-xs font-mono uppercase tracking-[0.2em]">Data Source</span>
                    {data.isMock ? (
                      <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full animate-pulse" /> DEMO MODE (MOCK)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> LIVE DATA
                      </span>
                    )}
                  </div>
                  {data.isMock && (
                    <p className="text-[10px] text-white/20 italic">Set GITHUB_TOKEN in .env.local for real data</p>
                  )}
                </div>

                <GameCanvas data={data} />

                <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-mono text-[#3fb950] flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> README_SNIPPET.MD
                    </h3>
                    <button
                      onClick={copyMarkdown}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors group flex items-center gap-2 text-xs uppercase tracking-widest"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[#3fb950]" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/60 group-hover:text-white" />
                      )}
                      {copied ? "COPIED" : "COPY"}
                    </button>
                  </div>
                  <pre className="p-4 bg-black/50 rounded-xl overflow-x-auto text-[10px] md:text-xs text-white/40 font-mono border border-white/5">
                    <code>{`[![Contribution Blast](${typeof window !== 'undefined' ? window.location.origin : ''}/api/v1/visualize/${username}?t=${Date.now()})](${typeof window !== 'undefined' ? window.location.origin : ''})`}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full w-full rounded-2xl border-2 border-dashed border-white/10 bg-white/2 flex flex-col items-center justify-center text-white/20 gap-4 group hover:border-white/20 transition-all duration-500">
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center animate-pulse group-hover:bg-white/5 transition-all">
                  <Rocket className="w-6 h-6" />
                </div>
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting launch coordinates</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-xs font-mono pb-8">
          <p>© 2026 CONTRIBUTION BLAST. BUILT FOR THE GRAPH.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#58a6ff] transition-colors">DOCUMENTATION</a>
            <a href="#" className="hover:text-[#3fb950] transition-colors">API REF</a>
            <a href="#" className="hover:text-white transition-colors">SOURCE</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
