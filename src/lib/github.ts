export type ContributionDay = {
  date: string;
  count: number;
  level: number; // 0-4
};

export type ContributionWeek = {
  days: ContributionDay[];
};

export type ContributionData = {
  username: string;
  totalContributions: number;
  weeks: ContributionWeek[];
  isMock?: boolean;
};

const GITHUB_GRAPHQL_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export async function fetchGitHubContributions(username: string): Promise<ContributionData> {
  const token = process.env.GITHUB_TOKEN;

  // For demo purposes, return mock data if no token is provided
  if (!token) {
    console.warn("GITHUB_TOKEN not found, returning mock data");
    return { ...generateMockContributions(username), isMock: true };
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GITHUB_GRAPHQL_QUERY,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  const calendar = result.data.user.contributionsCollection.contributionCalendar;

  return {
    username,
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((week: any) => ({
      days: week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: LEVEL_MAP[day.contributionLevel] || 0,
      })),
    })),
    isMock: false,
  };
}

function generateMockContributions(username: string): ContributionData {
  const weeks: ContributionWeek[] = [];
  const today = new Date();
  
  // Simple deterministic hash from username
  const hash = username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = hash % 100;
  
  // Total contributions deterministic on username
  const totalContributions = (hash * 13) % 2000;

  for (let w = 0; w < 52; w++) {
    const days: ContributionDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (51 - w) * 7 - (6 - d));
      
      // Deterministic "count" and "level" based on week, day and username hash
      const val = (hash + w * 7 + d) % 100;
      
      // Control density: only ~25% of days have contributions in mock mode
      // This threshold varies based on the username hash to simulate high/low activity
      const threshold = 70 + (seed % 25); 
      
      const hasContribution = val > threshold;
      const count = hasContribution ? (val % 10) + 1 : 0;
      const level = hasContribution ? (val % 4) + 1 : 0;

      days.push({
        date: date.toISOString().split("T")[0],
        count,
        level,
      });
    }
    weeks.push({ days });
  }

  return {
    username,
    totalContributions,
    weeks,
  };
}
