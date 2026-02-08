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
  const gameDurationBase = 40; 
  const laserHitX = 180; 

  let enemies = "";
  
  const allDays: { day: any; index: number }[] = [];
  data.weeks.forEach((week: any) => {
    week.days.forEach((day: any) => {
      if (day.count > 0) allDays.push({ day, index: allDays.length });
    });
  });

  const MAX_ENTITIES = 100;
  const step = Math.ceil(allDays.length / MAX_ENTITIES);
  const filteredDays = allDays.filter((_, i) => i % step === 0);

  const streamLength = 4000; 

  filteredDays.forEach(({ day, index }) => {
    const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];
    const color = colors[day.level] || colors[0];
    const size = 6 + day.level * 1.8;
    
    const seed = index * 1337 + day.count * 31;
    const rnd = (seed % 1000) / 1000; 
    const rnd2 = ((seed * 7) % 1000) / 1000;

    const xStart = width + (rnd * streamLength); 
    const y = 25 + (rnd2 * (height - 50)); 

    const speedFactor = 0.8 + ((seed % 20) / 20) * 0.7;
    const duration = gameDurationBase / speedFactor;

    const totalDist = xStart + 200;
    const distToHit = xStart - laserHitX;
    const tHit = distToHit / totalDist;
    const tHitFixed = Math.max(0, Math.min(0.99, tHit));
    const tHitEnd = Math.min(1, tHitFixed + 0.1); 

    const delay = ((seed % 50) / 10).toFixed(1);

    enemies += `
      <g>
        <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1">
          <animate attributeName="x" from="${xStart}" to="${-200}" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${tHitFixed};${tHitEnd};1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
          <animate attributeName="fill" values="${color};${color};#ffffff;#ffffff" keyTimes="0;${tHitFixed};${tHitFixed};1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
        </rect>
      </g>
    `;
  });

  // Automated Patrol Ship & Bullets
  // The ship will sweep up and down (Y: 20 -> 180 -> 20) over 10 seconds
  const shipAnimation = `
    <animateTransform attributeName="transform" type="translate" values="0 20; 0 160; 0 20" dur="8s" repeatCount="indefinite" />
  `;

  // Bullets need to spawn from the ship's current Y
  // We simulate this by giving them the SAME transform animation as the ship
  const particles = Array.from({ length: 15 }).map((_, i) => `
    <g>
      ${shipAnimation} <!-- Sync movement with ship -->
      <rect width="8" height="2" fill="#58a6ff" rx="1" opacity="0">
        <!-- Bullet moves across screen -->
        <animate attributeName="x" from="40" to="${width + 50}" dur="0.6s" repeatCount="indefinite" begin="${i * 0.5}s" />
        <animate attributeName="opacity" values="0;1;0" dur="0.6s" repeatCount="indefinite" begin="${i * 0.5}s" />
        <!-- Y position is fixed relative to the moving group -->
        <animate attributeName="y" from="10" to="10" dur="0.6s" repeatCount="indefinite" begin="${i * 0.5}s" /> 
      </rect>
    </g>
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
      
      <g opacity="0.3">
        ${Array.from({ length: 30 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 1.5}" fill="white" />
        `).join("")}
      </g>

      <g>${particles}</g>

      ${enemies}

      <!-- Patrolling Fighter Ship -->
      <g>
        ${shipAnimation}
        <g transform="translate(10, 10)"> 
          <path d="M 35,0 L 15,-7 L 15,7 Z" fill="url(#shipGrad)">
          </path>
        </g>
      </g>

      <rect x="20" y="10" width="160" height="24" fill="#0d1117" stroke="#30363d" rx="4" />
      <text x="30" y="26" fill="#58a6ff" font-family="monospace" font-size="9" font-weight="900" style="letter-spacing: 1px;">MISSION: ${username.toUpperCase()}</text>
      
      <rect x="${width - 150}" y="10" width="130" height="24" fill="#0d1117" stroke="#30363d" rx="4" />
      <text x="${width - 142}" y="26" fill="#3fb950" font-family="monospace" font-size="9" font-weight="900" style="letter-spacing: 1px;">CORE: ${data.totalContributions}</text>
    </svg>
  `;
}
