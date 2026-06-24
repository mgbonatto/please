# Please

> Working name — a structured community feedback platform.

Communities pour feedback into Reddit, forums, and Discord, where it ends up scattered and hard to
prioritize. **Please** turns that into structured **Issues** (problems) and **Solutions** (proposed
fixes) that people can attach links to and vote on, organized into per-topic **Spaces**.

**Status:** 🚧 Early development.

## Tech stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Postgres, Auth, Row-Level Security)
- **Vercel** (hosting)

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment: copy the example, then fill in your Supabase values
cp .env.local.example .env.local

# 3. Start the dev server
npm run dev
```

Then open <http://localhost:3000>.

You'll need a free [Supabase](https://supabase.com) project. Copy its **Project URL** and
**publishable key** into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
