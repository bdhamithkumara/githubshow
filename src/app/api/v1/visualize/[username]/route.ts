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
  const gameDurationBase = 35; 

  let enemies = "";
  
  data.weeks.forEach((week: any, wIndex: number) => {
    week.days.forEach((day: any, dIndex: number) => {
      if (day.count > 0) {
        const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
        const color = colors[day.level] || colors[0];
        const size = 5 + day.level * 1.5;
        
        // Break the vertical grid: Add horizontal jitter and individual delays
        const xJitter = ((dIndex * 71 + wIndex * 13) % 40) - 20; // Pseudo-random horizontal shifted
        const speedVar = 1 + ((dIndex * 31 + wIndex * 17) % 5) * 0.05; // 1.0 to 1.2x speed
        const individualDuration = gameDurationBase / speedVar;
        
        const xStart = width + wIndex * 180 + xJitter; 
        const y = 45 + dIndex * 18 + (Math.sin(wIndex * 0.5) * 5); // Slight wave formation
        const delay = (wIndex * 1.8 + dIndex * 0.1).toFixed(1);

        enemies += `
          <g>
            <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1">
              <animate attributeName="x" from="${xStart}" to="${-100}" dur="${individualDuration}s" repeatCount="indefinite" begin="-${delay}s" />
              <!-- Hit flickering simulation -->
              <animate attributeName="opacity" values="1;1;0.4;1;0.6;1;1" dur="${individualDuration}s" repeatCount="indefinite" begin="-${delay}s" />
            </rect>
            <!-- Core light -->
            <rect x="${xStart}" y="${y - size/2}" width="${size/2}" height="${size/2}" fill="white" opacity="0.2">
               <animate attributeName="x" from="${xStart}" to="${-100}" dur="${individualDuration}s" repeatCount="indefinite" begin="-${delay}s" />
               <animate attributeName="opacity" values="0;0.7;0" dur="0.15s" repeatCount="indefinite" />
            </rect>
          </g>
        `;
      }
    });
  });

  // Dynamic particle effects matching the ship's firing line
  const debris = Array.from({ length: 12 }).map((_, i) => `
    <rect width="1.5" height="1.5" fill="${i % 2 ? '#58a6ff' : '#3fb950'}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="${0.4 + i * 0.1}s" repeatCount="indefinite" begin="${i * 0.25}s" />
      <animate attributeName="x" from="55" to="${120 + i * 40}" dur="${0.4 + i * 0.1}s" repeatCount="indefinite" begin="${i * 0.25}s" />
      <animate attributeName="y" from="${height/2}" to="${height/2 + (i - 6) * 12}" dur="${0.4 + i * 0.1}s" repeatCount="indefinite" begin="${i * 0.25}s" />
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
      
      <!-- Parallax Stars -->
      <g opacity="0.15">
        ${Array.from({ length: 60 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 0.8}" fill="white" />
        `).join("")}
      </g>

      <!-- Connection Lines -->
      <g stroke="#ffffff" stroke-width="0.5" opacity="0.02">
        ${[40, 80, 120, 160].map(y => `<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`).join("")}
      </g>

      <!-- Particle bursts -->
      <g>${debris}</g>

      <!-- Enemies (Contributions) -->
      ${enemies}

      <!-- Player Ship -->
      <g>
        <path d="M 45,${height / 2} L 15,${height / 2 - 12} L 15,${height / 2 + 12} Z" fill="url(#shipGrad)">
          <animateTransform attributeName="transform" type="translate" values="0 0; 8 -50; -5 70; 12 -30; 0 0" dur="12s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; -15; 15; -10; 0" dur="12s" repeatCount="indefinite" additive="sum" />
        </path>
        <!-- Dynamic Dual-Lasers -->
        <g>
          <line x1="50" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#58a6ff" stroke-width="1.2" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0" dur="0.25s" repeatCount="indefinite" />
            <animate attributeName="x1" from="45" to="${width}" dur="0.25s" repeatCount="indefinite" />
            <animate attributeName="x2" from="65" to="${width + 40}" dur="0.25s" repeatCount="indefinite" />
          </line>
          <animateTransform attributeName="transform" type="translate" values="0 0; 8 -50; -5 70; 12 -30; 0 0" dur="12s" repeatCount="indefinite" />
        </g>
      </g>

      <!-- UI Overlay -->
      <rect x="15" y="15" width="200" height="20" fill="#0d1117" opacity="0.8" rx="4" />
      <text x="25" y="28" fill="#58a6ff" font-family="monospace" font-size="10" font-weight="bold">BLAST: ${username.toUpperCase()}</text>
      
      <rect x="${width - 150}" y="15" width="135" height="20" fill="#0d1117" opacity="0.8" rx="4" />
      <text x="${width - 140}" y="28" fill="#ffffff" font-family="monospace" font-size="9" opacity="0.4">TOTAL: ${data.totalContributions}</text>
    </svg>
  `;
}
