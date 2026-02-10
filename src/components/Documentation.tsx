
import React from 'react';
import { Rocket, FileCode, Zap, Target, MousePointer2 } from "lucide-react";

export const Documentation = () => {
    return (
        <section className="w-full max-w-6xl mx-auto mt-24 mb-20 px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Launch Your Galaxy
                </h2>
                <p className="text-white/40 max-w-2xl mx-auto text-lg">
                    Turn your contribution graph into an interactive space battle.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-24">
                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Rocket className="w-7 h-7 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">1. Enter Username</h3>
                    <p className="text-white/50 leading-relaxed">
                        Simply type your GitHub username into the field above. We'll fetch your contribution data instantly.
                    </p>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <MousePointer2 className="w-7 h-7 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">2. Interactive Preview</h3>
                    <p className="text-white/50 leading-relaxed">
                        Fly around and shoot asteroids in the interactive preview. The SVG matches this experience perfectly.
                    </p>
                </div>

                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <FileCode className="w-7 h-7 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">3. Add to Profile</h3>
                    <p className="text-white/50 leading-relaxed">
                        Copy the generated markdown code and paste it into your GitHub profile README. It's that easy.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl border border-white/10 p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                    <Zap className="text-yellow-400" />
                    Key Features
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                                <Target className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-1">Sniper Mode</h4>
                                <p className="text-white/50 text-sm">
                                    Smart targeting system that engages only 5% of enemies for a clean, deliberate "one shot, one kill" aesthetic.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                <Rocket className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-1">Zero Lag</h4>
                                <p className="text-white/50 text-sm">
                                    Optimized SVG rendering with static starfields and entity caps ensures smooth performance on any profile.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
                                <FileCode className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-1">Cache Busting</h4>
                                <p className="text-white/50 text-sm">
                                    Automatic timestamp generation ensures GitHub always displays your latest stats, bypassing aggressive caching.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-1">Visual Parity</h4>
                                <p className="text-white/50 text-sm">
                                    The static SVG perfectly mimics the dynamic web preview, including ship patrol patterns and explosion effects.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
