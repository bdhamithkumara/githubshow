import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubContributions } from "@/lib/github";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

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
  const gameDuration = 40; // Slower for better readability

  let enemies = "";
  
  data.weeks.forEach((week: any, wIndex: number) => {
    week.days.forEach((day: any, dIndex: number) => {
      if (day.count > 0) {
        const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
        const color = colors[day.level] || colors[0];
        const size = 5 + day.level * 1.5;
        
        // Squadron formation: Week waves are spaced out, days are staggered
        const xOffset = (dIndex % 2) * 15; // Zig-zag stagger
        const xStart = width + wIndex * 220 + xOffset; 
        const y = 40 + dIndex * 20;
        const delay = (wIndex * 2.5).toFixed(1);

        enemies += `
          <g>
            <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1">
              <animate attributeName="x" from="${xStart}" to="${-100}" dur="${gameDuration}s" repeatCount="indefinite" begin="-${delay}s" />
              <!-- Hit flickering simulation when passing the ship zone (x ~ 40 to 100) -->
              <animate attributeName="opacity" values="1;1;0.3;1;0.5;1;1" dur="${gameDuration}s" repeatCount="indefinite" begin="-${delay}s" />
            </rect>
            <!-- Core flicker -->
            <rect x="${xStart}" y="${y - size/2}" width="${size/2}" height="${size/2}" fill="white" opacity="0.3">
               <animate attributeName="x" from="${xStart}" to="${-100}" dur="${gameDuration}s" repeatCount="indefinite" begin="-${delay}s" />
               <animate attributeName="opacity" values="0;0.8;0" dur="0.2s" repeatCount="indefinite" />
            </rect>
          </g>
        `;
      }
    });
  });

  // Debris/Explosion particles near the ship
  const debris = Array.from({ length: 8 }).map((_, i) => `
    <rect width="2" height="2" fill="${i % 2 ? '#58a6ff' : '#3fb950'}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="${0.5 + i * 0.1}s" repeatCount="indefinite" begin="${i * 0.2}s" />
      <animate attributeName="x" from="60" to="${100 + i * 30}" dur="${0.5 + i * 0.1}s" repeatCount="indefinite" begin="${i * 0.2}s" />
      <animate attributeName="y" from="${height/2}" to="${height/2 + (i - 4) * 15}" dur="${0.5 + i * 0.1}s" repeatCount="indefinite" begin="${i * 0.2}s" />
    </rect>
  `).join("");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3fb950;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0d1117" rx="10" />
      
      <!-- Starfield -->
      <g opacity="0.1">
        ${Array.from({ length: 40 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 0.8}" fill="white" />
        `).join("")}
      </g>

      <!-- Connection Lines -->
      <g stroke="#ffffff" stroke-width="0.5" opacity="0.03">
        ${[50, 100, 150].map(y => `<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`).join("")}
      </g>

      <!-- Debris/Hits -->
      <g>${debris}</g>

      <!-- Enemies (Contributions) -->
      ${enemies}

      <!-- Player Ship -->
      <g>
        <path d="M 40,${height / 2} L 15,${height / 2 - 15} L 15,${height / 2 + 15} Z" fill="url(#shipGrad)">
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 -40; -2 60; 8 -20; 0 0" dur="10s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; -10; 10; -5; 0" dur="10s" repeatCount="indefinite" additive="sum" />
        </path>
        <!-- Laser Shots -->
        <g>
          <line x1="45" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="#58a6ff" stroke-width="1.5" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="x1" from="40" to="${width}" dur="0.3s" repeatCount="indefinite" />
            <animate attributeName="x2" from="60" to="${width + 30}" dur="0.3s" repeatCount="indefinite" />
          </line>
          <animateTransform attributeName="transform" type="translate" values="0 0; 5 -40; -2 60; 8 -20; 0 0" dur="10s" repeatCount="indefinite" />
        </g>
      </g>

      <!-- UI Overlay -->
      <text x="20" y="25" fill="#58a6ff" font-family="monospace" font-size="10" font-weight="bold" opacity="0.6">CONTRIBUTION_BLAST: ${username.toUpperCase()}</text>
      <text x="${width - 140}" y="25" fill="#ffffff" font-family="monospace" font-size="9" opacity="0.3">TOTAL_COMMITS: ${data.totalContributions}</text>
    </svg>
  `;
}
