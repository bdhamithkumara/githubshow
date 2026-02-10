
import React from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, FileCode, Zap, Globe, Github } from "lucide-react";

export default function DocsPage() {
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
                        Back to Visualization
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        Documentation
                    </h1>
                    <p className="text-xl text-white/40 max-w-2xl">
                        Everything you need to know about setting up and customizing your Contribution Blast visualization.
                    </p>
                </div>

                {/* Quick Start */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <Zap className="text-yellow-400" />
                        Quick Start
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/60 mb-6">
                                The fastest way to get started is using our hosted API. Just replace <code>YOUR_USERNAME</code> with your GitHub handle.
                            </p>
                            <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-[#58a6ff] overflow-x-auto border border-white/5 mb-6">
                                [![Contribution Blast](https://github-galaxy-blast.vercel.app/api/v1/visualize/YOUR_USERNAME)](https://github-galaxy-blast.vercel.app)
                            </div>
                            <p className="text-white/60 text-sm">
                                <strong>Note:</strong> We automatically append a timestamp to the image URL to prevent GitHub's aggressive caching.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features & Mechanics */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <Terminal className="text-blue-400" />
                        Game Mechanics
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-2">Asteroid Field</h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Your contribution days are visualized as asteroids. The size and color intensity of each asteroid matches your contribution activity level for that day.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-2">Sniper Targeting</h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                To maintain a clean aesthetic, the ship ("Sniper Mode") automatically targets ~5% of contribution squares. Each target is destroyed with a precise, synchronized laser shot.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Self Hosting */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                        <Globe className="text-green-400" />
                        Self Hosting
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
                        <p className="text-white/60 mb-6">
                            Prefer to host it yourself? You can deploy this project to Vercel in seconds.
                        </p>
                        <ol className="list-decimal list-inside space-y-4 text-white/60 mb-8 ml-2">
                            <li>Fork the repository on GitHub.</li>
                            <li>Create a new project on Vercel and import your fork.</li>
                            <li>Set the <code>GITHUB_TOKEN</code> environment variable (optional, for higher rate limits).</li>
                            <li>Deploy! Your API will be available at <code>/api/v1/visualize/[username]</code>.</li>
                        </ol>
                        <a
                            href="https://github.com/bdhamithkumara/githubshow"
                            target="_blank"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-medium transition-colors text-sm"
                        >
                            <Github className="w-4 h-4" />
                            View on GitHub
                        </a>
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
