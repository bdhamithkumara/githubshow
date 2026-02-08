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
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
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
  const gameDurationBase = 40; // Slower to match web pacing

  let enemies = "";
  
  const allDays: { day: any; index: number }[] = [];
  data.weeks.forEach((week: any) => {
    week.days.forEach((day: any) => {
      if (day.count > 0) allDays.push({ day, index: allDays.length });
    });
  });

  const streamLength = 4000; 

  allDays.forEach(({ day, index }) => {
    // Exact GitHub Contribution Greens
    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    const color = colors[day.level] || colors[0];
    const size = 6 + day.level * 1.8; // Slightly larger for better readability
    
    const seed = index * 1337 + day.count * 31;
    const rnd = (seed % 1000) / 1000; 
    const rnd2 = ((seed * 7) % 1000) / 1000;

    const xStart = width + (rnd * streamLength); 
    const y = 25 + (rnd2 * (height - 50)); 

    const speedFactor = 0.8 + ((seed % 20) / 20) * 0.7;
    const duration = gameDurationBase / speedFactor;

    const delay = ((seed % 50) / 10).toFixed(1);

    enemies += `
      <g>
        <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1" opacity="0.9">
          <animate attributeName="x" from="${xStart}" to="${-200}" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
          
          <!-- Hit flicker simulation -->
          <animate attributeName="fill" values="${color};${color};#ffffff;${color};#39d353;${color}" 
            keyTimes="0;0.1;0.12;0.14;0.16;1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
        </rect>
      </g>
    `;
  });

  // Dual Laser Particles (Sparks)
  const particles = Array.from({ length: 15 }).map((_, i) => `
    <rect width="1.5" height="1.5" fill="${i % 2 ? '#58a6ff' : '#3fb950'}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="${0.2 + i * 0.04}s" repeatCount="indefinite" begin="${i * 0.1}s" />
      <animate attributeName="x" from="60" to="${width/2 + i * 20}" dur="${0.2 + i * 0.04}s" repeatCount="indefinite" begin="${i * 0.1}s" />
      <animate attributeName="y" from="${height/2 + (i%2 ? -2 : 2)}" to="${height/2 + (i - 7) * 10}" dur="${0.2 + i * 0.04}s" repeatCount="indefinite" begin="${i * 0.1}s" />
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
      
      <!-- Parallax Starfield (3 Layers) -->
      <g opacity="0.1">
        <!-- Deep Stars (Slowest) -->
        ${Array.from({ length: 30 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="0.5" fill="white">
            <animate attributeName="cx" from="${Math.random() * width}" to="${-width}" dur="${200 + i * 5}s" repeatCount="indefinite" />
          </circle>
        `).join("")}
        <!-- Mid Stars -->
        ${Array.from({ length: 20 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="0.8" fill="#58a6ff">
            <animate attributeName="cx" from="${Math.random() * width}" to="${-width}" dur="${100 + i * 3}s" repeatCount="indefinite" />
          </circle>
        `).join("")}
        <!-- Near Stars (Fastest) -->
        ${Array.from({ length: 10 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="1.2" fill="#3fb950">
            <animate attributeName="cx" from="${Math.random() * width}" to="${-width}" dur="${40 + i * 2}s" repeatCount="indefinite" />
          </circle>
        `).join("")}
      </g>

      <g>${particles}</g>

      <!-- Contributions -->
      ${enemies}

      <!-- Player Ship & Dual Lasers -->
      <g>
        <path d="M 55,${height / 2} L 15,${height / 2 - 14} L 15,${height / 2 + 14} Z" fill="url(#shipGrad)">
          <animateTransform attributeName="transform" type="translate" values="0 0; 12 -65; -10 85; 20 -45; 0 0" dur="18s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; -25; 30; -18; 0" dur="18s" repeatCount="indefinite" additive="sum" />
        </path>
        
        <!-- Dual Laser Firing Patterns -->
        <g>
          <!-- Top Laser -->
          <line x1="55" y1="${height/2 - 4}" x2="${width}" y2="${height/2 - 4}" stroke="#58a6ff" stroke-width="1.8" opacity="0">
            <animate attributeName="opacity" values="0;1;0" dur="0.18s" repeatCount="indefinite" />
            <animate attributeName="x1" from="55" to="${width}" dur="0.18s" repeatCount="indefinite" />
            <animate attributeName="x2" from="80" to="${width + 60}" dur="0.18s" repeatCount="indefinite" />
          </line>
          <!-- Bottom Laser (Slight Offset) -->
          <line x1="55" y1="${height/2 + 4}" x2="${width}" y2="${height/2 + 4}" stroke="#3fb950" stroke-width="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="0.22s" repeatCount="indefinite" begin="0.05s" />
            <animate attributeName="x1" from="55" to="${width}" dur="0.22s" repeatCount="indefinite" begin="0.05s" />
            <animate attributeName="x2" from="80" to="${width + 40}" dur="0.22s" repeatCount="indefinite" begin="0.05s" />
          </line>
          <animateTransform attributeName="transform" type="translate" values="0 0; 12 -65; -10 85; 20 -45; 0 0" dur="18s" repeatCount="indefinite" />
        </g>
      </g>

      <!-- HUD UI (Clean Look) -->
      <rect x="20" y="10" width="160" height="24" fill="#0d1117" stroke="#30363d" rx="4" />
      <text x="30" y="26" fill="#58a6ff" font-family="monospace" font-size="9" font-weight="900" style="letter-spacing: 1px;">MISSION: ${username.toUpperCase()}</text>
      
      <rect x="${width - 150}" y="10" width="130" height="24" fill="#0d1117" stroke="#30363d" rx="4" />
      <text x="${width - 142}" y="26" fill="#3fb950" font-family="monospace" font-size="9" font-weight="900" style="letter-spacing: 1px;">CORE: ${data.totalContributions}</text>
    </svg>
  `;
}
