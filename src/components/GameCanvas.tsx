"use client";

import React, { useEffect, useRef, useState } from "react";
import { GameEngine } from "@/lib/game-engine";
import { ContributionData } from "@/lib/github";

interface GameCanvasProps {
    data: ContributionData;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [engine, setEngine] = useState<GameEngine | null>(null);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (!data) return;
        const newEngine = new GameEngine(data, 800, 400);
        setEngine(newEngine);
    }, [data]);

    useEffect(() => {
        if (!engine || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleY = canvas.height / rect.height;
            const y = (e.clientY - rect.top) * scaleY;
            engine.setPlayerY(y);
            if (Math.random() < 0.2) engine.shoot();
        };

        canvas.addEventListener("mousemove", handleMouseMove);

        const render = () => {
            engine.update();
            const state = engine.getState();
            setScore(state.score);

            // Clear
            ctx.fillStyle = "#0a0a0a";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Starfield (simple)
            ctx.fillStyle = "#ffffff";
            for (let i = 0; i < 50; i++) {
                const x = (Math.sin(i * 1234 + Date.now() / 1000) * 0.5 + 0.5) * canvas.width;
                const y = (Math.cos(i * 5678 + Date.now() / 2000) * 0.5 + 0.5) * canvas.height;
                ctx.globalAlpha = 0.2;
                ctx.fillRect(x, y, 1, 1);
            }
            ctx.globalAlpha = 1.0;

            // Draw Player
            ctx.fillStyle = state.player.color;
            ctx.beginPath();
            ctx.moveTo(state.player.position.x + 15, state.player.position.y);
            ctx.lineTo(state.player.position.x - 10, state.player.position.y - 12);
            ctx.lineTo(state.player.position.x - 10, state.player.position.y + 12);
            ctx.closePath();
            ctx.fill();

            // Draw Projectiles
            state.projectiles.forEach((p) => {
                ctx.fillStyle = state.player.color;
                ctx.fillRect(p.position.x, p.position.y - 1, p.size * 2, 2);
            });

            // Draw Enemies
            state.enemies.forEach((e) => {
                ctx.fillStyle = e.color;
                const size = e.size;
                ctx.fillRect(e.position.x - size / 2, e.position.y - size / 2, size, size);
                ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
                ctx.strokeRect(e.position.x - size / 2, e.position.y - size / 2, size, size);
            });

            // Ambient shooting
            if (Math.random() < 0.05) {
                engine.shoot();
            }

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationId);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, [engine]);

    return (
        <div className="relative group overflow-hidden rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm">
            <div className="absolute top-4 left-4 z-10 font-mono text-[#58a6ff] drop-shadow-lg">
                SCORE: {score.toString().padStart(6, "0")}
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-auto aspect-video max-w-4xl cursor-crosshair"
            />
            <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-[#0e4429] via-[#006d32] to-[#39d353] opacity-50" />
        </div>
    );
};
