import { ContributionData, ContributionDay } from "./github";

export type Vector2D = { x: number; y: number };

export type Entity = {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  type: "player" | "enemy" | "projectile";
  color: string;
  level?: number;
};

export type GameState = {
  player: Entity;
  enemies: Entity[];
  projectiles: Entity[];
  score: number;
  width: number;
  height: number;
  isGameOver: boolean;
};

export class GameEngine {
  private state: GameState;
  private contributionData: ContributionData;
  private currentWeekIndex: number = 0;
  private spawnTimer: number = 0;
  private readonly SPAWN_INTERVAL = 30; // frames

  constructor(data: ContributionData, width: number = 800, height: number = 400) {
    this.contributionData = data;
    this.state = {
      player: {
        id: "player",
        position: { x: 50, y: height / 2 },
        velocity: { x: 0, y: 0 },
        size: 30,
        type: "player",
        color: "#58a6ff", // GitHub blue
      },
      enemies: [],
      projectiles: [],
      score: 0,
      width,
      height,
      isGameOver: false,
    };
  }

  public update() {
    if (this.state.isGameOver) return;

    // Movement handled via setPlayerY directly in game loop for better responsiveness

    // Spawn waves from contribution data
    this.spawnTimer++;
    if (this.spawnTimer >= this.SPAWN_INTERVAL) {
      this.spawnTimer = 0;
      this.spawnWeek();
    }

    // Update projectiles
    this.state.projectiles.forEach((p) => {
      p.position.x += p.velocity.x;
    });
    this.state.projectiles = this.state.projectiles.filter(
      (p) => p.position.x < this.state.width
    );

    // Update enemies
    this.state.enemies.forEach((e) => {
      e.position.x += e.velocity.x;
      // Some vertical movement for higher levels
      if (e.level && e.level > 2) {
        e.position.y += Math.sin(e.position.x / 50) * 2;
      }
    });

    // Collision detection
    this.checkCollisions();

    // Clean up
    this.state.enemies = this.state.enemies.filter((e) => e.position.x > -50);
  }

  private spawnWeek() {
    if (this.currentWeekIndex >= this.contributionData.weeks.length) {
      this.currentWeekIndex = 0; // Loop or end
    }

    const week = this.contributionData.weeks[this.currentWeekIndex];
    const cellHeight = (this.state.height - 100) / 7;

    week.days.forEach((day, i) => {
      if (day.count > 0) {
        this.state.enemies.push({
          id: `enemy-${this.currentWeekIndex}-${i}`,
          position: { x: this.state.width + 20, y: 50 + i * cellHeight },
          velocity: { x: -3 - day.level, y: 0 },
          size: 12 + day.level * 2, // Slightly more uniform for squares
          type: "enemy",
          color: this.getGitHubColor(day.level),
          level: day.level,
        });
      }
    });

    this.currentWeekIndex++;
  }

  private getGitHubColor(level: number): string {
    const colors = [
      "#161b22", // L0
      "#0e4429", // L1
      "#006d32", // L2
      "#26a641", // L3
      "#39d353", // L4
    ];
    return colors[level] || colors[0];
  }

  private checkCollisions() {
    this.state.projectiles.forEach((p) => {
      this.state.enemies.forEach((e, index) => {
        const dx = p.position.x - e.position.x;
        const dy = p.position.y - e.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (p.size + e.size) / 2) {
          // Hit!
          this.state.score += (e.level || 1) * 10;
          this.state.enemies.splice(index, 1);
          // In a real implementation, we'd remove the projectile too or make it piercing
          p.position.x = this.state.width + 1000; // Move out of bounds
        }
      });
    });
  }

  public shoot() {
    this.state.projectiles.push({
      id: `p-${Date.now()}`,
      position: { x: this.state.player.position.x + 20, y: this.state.player.position.y },
      velocity: { x: 10, y: 0 },
      size: 4,
      type: "projectile",
      color: "var(--neon-blue)",
    });
  }

  public setPlayerY(y: number) {
    // Clamp to canvas bounds
    const padding = 20;
    this.state.player.position.y = Math.max(padding, Math.min(this.state.height - padding, y));
  }

  public getState() {
    return this.state;
  }
}
