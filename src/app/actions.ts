"use server";

import { fetchGitHubContributions } from "@/lib/github";

export async function getContributionsAction(username: string) {
  try {
    return await fetchGitHubContributions(username);
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch GitHub contributions");
  }
}
