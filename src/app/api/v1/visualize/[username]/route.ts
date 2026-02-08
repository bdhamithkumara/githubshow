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
  const gameDurationBase = 30; 

  let enemies = "";
  
  // Flatten days but keep wIndex/dIndex for deterministic jitter
  const allDays: { day: any; w: number; d: number }[] = [];
  data.weeks.forEach((week: any, wIndex: number) => {
    week.days.forEach((day: any, dIndex: number) => {
      if (day.count > 0) allDays.push({ day, w: wIndex, d: dIndex });
    });
  });

  // Limit density on SVG to prevent 'walls' of squares
  // Only show ~40% of contributions but keep them varied
  const filteredDays = allDays.filter((_, i) => (i % 2 === 0));

  filteredDays.forEach(({ day, w, d }, index) => {
    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    const color = colors[day.level] || colors[0];
    const size = 5 + day.level * 1.5;
    
    // CHAOTIC POSITIONING: Use large primes to throw off alignment
    // w*144 + d*23 + index*17 ensures no two squares move on the same line
    const xBase = width + w * 160 + d * 35;
    const xJitter = ((w * 144 + d * 23 + index * 17) % 150) - 75;
    const xStart = xBase + xJitter;

    // VARIABLE SPEED: Break the solid wall feel
    const speedFactor = 0.8 + ((w * 7 + d * 13) % 10) * 0.05; // 0.8x to 1.3x speed
    const duration = gameDurationBase / speedFactor;
    
    // STAGGERED Y: More floaty, less grid-bound
    const yJitter = ((w * 11 + d * 31) % 20) - 10;
    const y = 45 + d * 18 + yJitter;

    // DELAY: Offset each square so they don't enter the screen together
    const delay = (w * 1.5 + (index % 10) * 0.5).toFixed(1);

    enemies += `
      <g>
        <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1" opacity="0.9">
          <animate attributeName="x" from="${xStart}" to="${-100}" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
          <!-- Hit flicker simulation: squares flicker when in 'firing range' (x ~ 40 to 120) -->
          <animate attributeName="opacity" values="1;1;0.4;1;0.7;1;1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
        </rect>
        <rect x="${xStart}" y="${y - size/2}" width="${size/2}" height="${size/2}" fill="white" opacity="0.1">
           <animate attributeName="x" from="${xStart}" to="${-100}" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
           <animate attributeName="opacity" values="0;0.5;0" dur="0.2s" repeatCount="indefinite" />
        </rect>
      </g>
    `;
  });

  // Animated ship debris/sparks
  const particles = Array.from({ length: 10 }).map((_, i) => `
    <rect width="1.5" height="1.5" fill="${i % 2 ? '#58a6ff' : '#3fb950'}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="${0.3 + i * 0.05}s" repeatCount="indefinite" begin="${i * 0.15}s" />
      <animate attributeName="x" from="60" to="${150 + i * 50}" dur="${0.3 + i * 0.05}s" repeatCount="indefinite" begin="${i * 0.15}s" />
      <animate attributeName="y" from="${height/2}" to="${height/2 + (i - 5) * 12}" dur="${0.3 + i * 0.05}s" repeatCount="indefinite" begin="${i * 0.15}s" />
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
      
      <!-- Galactic Background -->
      <g opacity="0.2">
        ${Array.from({ length: 50 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 0.8}" fill="white" />
        `).join("")}
      </g>

      <!-- Debris -->
      <g>${particles}</g>

      <!-- Contributions -->
      ${enemies}

      <!-- Player Ship -->
      <g>
        <path d="M 50,${height / 2} L 15,${height / 2 - 12} L 15,${height / 2 + 12} Z" fill="url(#shipGrad)">
          <animateTransform attributeName="transform" type="translate" values="0 0; 10 -60; -8 80; 15 -40; 0 0" dur="15s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" values="0; -20; 25; -15; 0" dur="15s" repeatCount="indefinite" additive="sum" />
        </path>
        <g>
          <line x1="55" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#58a6ff" stroke-width="1.5" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0" dur="0.2s" repeatCount="indefinite" />
            <animate attributeName="x1" from="50" to="${width}" dur="0.2s" repeatCount="indefinite" />
            <animate attributeName="x2" from="70" to="${width + 50}" dur="0.2s" repeatCount="indefinite" />
          </line>
          <animateTransform attributeName="transform" type="translate" values="0 0; 10 -60; -8 80; 15 -40; 0 0" dur="15s" repeatCount="indefinite" />
        </g>
      </g>

      <!-- HUD Labels -->
      <rect x="15" y="10" width="180" height="20" fill="#0d1117" opacity="0.9" rx="4" />
      <text x="25" y="23" fill="#58a6ff" font-family="monospace" font-size="9" font-weight="bold">MISSION: ${username.toUpperCase()}</text>
      
      <rect x="${width - 160}" y="10" width="145" height="20" fill="#0d1117" opacity="0.9" rx="4" />
      <text x="${width - 150}" y="23" fill="#ffffff" font-family="monospace" font-size="9" opacity="0.4">COMPLETED: ${data.totalContributions} UNITS</text>
    </svg>
  `;
}
