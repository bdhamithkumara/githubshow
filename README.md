This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




Project Enhancement Proposals
Here are several suggestions to elevate "Contribution Blast" to the next level, ranging from visual polish to gameplay mechanics.

1. Audio Experience (High Impact, Low Effort)
The game is currently silent. Adding retro sound effects will significantly improve the "game feel".

Shoot Sound: A short 8-bit laser blip.
Explosion Sound: A crummy, low-fi explosion noise when hitting an asteroid.
Power-up Sound: A positive chime.
2. Gameplay Depth
currently, it's a simple shooter. We can add varied mechanics to make it more engaging.

Boss Battles: Spawn a large "Merge Conflict" boss every 10 weeks that requires multiple hits to defeat.
Power-ups: Special "Commit" blocks that grant:
Rapid Fire: Increased attack speed.
Spread Shot: Shoot 3 bullets at once.
Combo System: Increase score multiplier for consecutive hits without missing.
3. Visual & UI Polish
Themes: Allow users to toggle between different color themes (GitHub Dark, Light, Halloween, Drcula).
Game Over Screen: A proper summary screen showing:
Final Score
Total Contributions Destroyed
Accuracy
"Share to Twitter" button.
4. Technical Improvements
Rate Limiting Handling: Better specific error messages when the GitHub API rate limit is hit.
OG Images: Dynamic Open Graph images for social sharing that show the user's stats.
Recommendation
I recommend starting with Phase 1: Audio & Game Over Screen. This will make the current loop feel complete before adding complex mechanics like bosses.
