
import React from "react";
import Link from "next/link";
import { ArrowLeft, FileCode, Github } from "lucide-react";

export default function ApiReferencePage() {
    return (
        <main className="min-h-screen bg-[#0d1117] text-white selection:bg-[#58a6ff] selection:text-[#0d1117] font-sans pb-20">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#58a6ff]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#3fb950]/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-white to-white/60 bg-clip-text text-transparent">
                        API Reference
                    </h1>
                    <p className="text-xl text-white/40 max-w-2xl">
                        Detailed documentation for the Contribution Blast API.
                    </p>
                </div>

                {/* API Reference Content */}
                <section className="mb-16">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-mono font-bold">GET</span>
                            <code className="text-white/80 font-mono text-sm break-all">/api/v1/visualize/[username]</code>
                        </div>

                        <p className="text-white/60 mb-8">
                            Generates a live SVG image of the specified user's contribution graph.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Path Parameters</h3>
                                <div className="grid grid-cols-[1fr_2fr] gap-4 border-b border-white/5 pb-4">
                                    <code className="text-[#58a6ff] font-mono text-sm">username</code>
                                    <p className="text-white/60 text-sm">The GitHub username to visualize.</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Response</h3>
                                <div className="grid grid-cols-[1fr_2fr] gap-4 border-b border-white/5 pb-4">
                                    <span className="text-white/80 text-sm">Content-Type</span>
                                    <code className="text-yellow-400/80 font-mono text-sm">image/svg+xml</code>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-3">Example Usage</h3>
                                <div className="bg-black/50 rounded-xl p-4 border border-white/5">
                                    <code className="text-white/60 font-mono text-sm">
                                        <span className="text-purple-400">curl</span> https://github-galaxy-blast.vercel.app/api/v1/visualize/torvalds
                                    </code>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-8 border-t border-white/5 flex items-center justify-between text-white/20 text-xs font-mono">
                    <p>DOCS v1.0.0</p>
                    <p>CONTRIBUTION BLAST</p>
                </footer>
            </div>
        </main>
    );
}
