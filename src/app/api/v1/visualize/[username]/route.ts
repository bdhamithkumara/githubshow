import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubContributions } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  try {
    const data = await fetchGitHubContributions(username);
    const svg = generateSVG(data, username);

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    return new NextResponse(
      `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="50">
        <text x="10" y="30" fill="red">Error: ${error.message}</text>
      </svg>`,
      { status: 500, headers: { "Content-Type": "image/svg+xml" } }
    );
  }
}

function generateSVG(data: any, username: string) {
  const width = 800;
  const height = 200;
  const gameDuration = 30; // seconds

  let enemies = "";
  
  data.weeks.forEach((week: any, wIndex: number) => {
    week.days.forEach((day: any, dIndex: number) => {
      if (day.count > 0) {
        const colors = [
          "#161b22", // L0
          "#0e4429", // L1
          "#006d32", // L2
          "#26a641", // L3
          "#39d353", // L4
        ];
        const color = colors[day.level] || colors[0];
        const size = 6 + day.level * 2;
        const xStart = width + wIndex * 150 + dIndex * 20;
        const y = 30 + dIndex * 20;
        const delay = (wIndex * 1.5).toFixed(1);

        enemies += `
          <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1">
            <animate attributeName="x" from="${xStart}" to="${-100}" dur="${gameDuration}s" repeatCount="indefinite" begin="-${delay}s" />
          </rect>
        `;
      }
    });
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3fb950;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0d1117" rx="10" />
      
      <!-- Starfield (Subtle) -->
      <g opacity="0.1">
        ${Array.from({ length: 50 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 1}" fill="white" />
        `).join("")}
      </g>

      <!-- Connection Lines (Parallax Background) -->
      <g stroke="#ffffff" stroke-width="0.5" opacity="0.05">
        <line x1="0" y1="50" x2="${width}" y2="50" />
        <line x1="0" y1="100" x2="${width}" y2="100" />
        <line x1="0" y1="150" x2="${width}" y2="150" />
      </g>

      <!-- Enemies (Contributions) -->
      ${enemies}

      <!-- Player Ship -->
      <g>
        <path d="M 40,${height / 2} L 15,${height / 2 - 15} L 15,${height / 2 + 15} Z" fill="url(#shipGrad)">
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 -30; -2 40; 8 -10; 0 0" dur="8s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; -5; 5; -2; 0" dur="8s" repeatCount="indefinite" additive="sum" />
        </path>
        <!-- Laser Shots -->
        <g>
          <line x1="45" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="#58a6ff" stroke-width="1.5" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.4s" repeatCount="indefinite" begin="0.1s" />
            <animate attributeName="x1" from="40" to="${width}" dur="0.4s" repeatCount="indefinite" begin="0.1s" />
            <animate attributeName="x2" from="60" to="${width + 20}" dur="0.4s" repeatCount="indefinite" begin="0.1s" />
          </line>
          <line x1="45" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="#3fb950" stroke-width="1" opacity="0">
            <animate attributeName="opacity" values="0;0.5;0" dur="0.7s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="x1" from="40" to="${width}" dur="0.7s" repeatCount="indefinite" begin="0.3s" />
            <animate attributeName="x2" from="60" to="${width + 20}" dur="0.7s" repeatCount="indefinite" begin="0.3s" />
          </line>
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 -30; -2 40; 8 -10; 0 0" dur="8s" repeatCount="indefinite" />
        </g>
      </g>

      <!-- UI Overlay -->
      <text x="20" y="30" fill="#58a6ff" font-family="monospace" font-size="11" font-weight="bold" opacity="0.8">GITHUB_CONTRIBUTION_BLAST: ${username.toUpperCase()}</text>
      <text x="${width - 150}" y="30" fill="#ffffff" font-family="monospace" font-size="10" opacity="0.4">CONTRIBUTIONS: ${data.totalContributions}</text>
    </svg>
  `;
}
