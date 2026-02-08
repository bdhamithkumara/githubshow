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

  const MAX_ENTITIES = 60;
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

    // TARGETING LOGIC
    // Only target ~25% of enemies to reduce bullet clutter
    // Use modulo for deterministic behavior
    const delay = ((seed % 50) / 10).toFixed(1);
    const isTarget = index % 15 === 0; // 1 in 15 with 60 entities = 4 shots total

    if (isTarget) {
      // 1. TARGETED ENEMY -> GETS A BULLET
      const totalDist = xStart + 200;
      const distToHit = xStart - laserHitX;
      const pctHit = distToHit / totalDist; 
      
      const tHit = Math.max(0.01, Math.min(0.90, pctHit));
      const tExplode = tHit + 0.02;

      enemies += `
        <g>
           <!-- Bullet: Moves to target, then vanishes -->
           <rect x="50" y="${y}" width="10" height="2" fill="#58a6ff" rx="1" opacity="0">
              <animate attributeName="x" values="50; ${laserHitX}; ${laserHitX + 50}" keyTimes="0; ${tHit}; 1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
              <animate attributeName="opacity" values="1; 1; 0; 0" keyTimes="0; ${tHit}; ${tHit}; 1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
           </rect>

           <!-- Exploding Enemy -->
           <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1">
              <animate attributeName="x" from="${xStart}" to="${-200}" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
              <!-- Destruction: Just Opacity/Fill (Performance Optimization) -->
              <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${tHit};${tExplode};1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
              <animate attributeName="fill" values="${color};${color};#ffffff;#ffffff" keyTimes="0;${tHit};${tHit};1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
           </rect>
        </g>
      `;
    } else {
      // 2. IGNORED ENEMY -> DRIFTS PAST (NO BULLET)
      enemies += `
        <g>
           <rect x="${xStart}" y="${y - size/2}" width="${size}" height="${size}" fill="${color}" rx="1" opacity="0.8">
              <animate attributeName="x" from="${xStart}" to="${-200}" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
              <!-- Simple fade out at very end -->
              <animate attributeName="opacity" values="0.8;0.8;0" keyTimes="0;0.9;1" dur="${duration}s" repeatCount="indefinite" begin="-${delay}s" />
           </rect>
        </g>
      `;
    }
  });

  // Automated Patrol Ship (No independent bullets now)
  const shipAnimation = `
    <animateTransform attributeName="transform" type="translate" values="0 20; 0 160; 0 20" dur="8s" repeatCount="indefinite" />
  `;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <defs>
        <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#58a6ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#3fb950;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0d1117" rx="10" />
      
      <!-- Static Starfield (Maximum Performance) -->
      <g opacity="0.2">
        ${Array.from({ length: 20 }).map((_, i) => `
          <circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${Math.random() * 1.5}" fill="white" />
        `).join("")}
      </g>

      <!-- Enemies & Targeted Projectiles -->
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
