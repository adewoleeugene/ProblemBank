This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

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

## Environment Variables

### Ideas Page Feature

The Ideas page requires Airtable configuration. Add these environment variables to your `.env.local` file:

```bash
# Airtable credentials for Ideas page
AIRTABLE_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=your_table_name

# Optional: Field names (defaults will be used if not set)
AIRTABLE_TITLE_FIELD=Title
AIRTABLE_BLURB_FIELD=Blurb
AIRTABLE_CATEGORY_FIELD=Category
AIRTABLE_SORT_FIELD=Order
AIRTABLE_SORT_DIRECTION=asc
```

**Note:** If these variables are not set, the Ideas page will show an empty state gracefully.

### Find-a-Team Feature

The Find-a-Team feature requires Airtable configuration. Add these environment variables to your `.env.local` file:

```bash
# Airtable credentials for TeamBoard
AIRTABLE_TEAM_TOKEN=your_airtable_token
AIRTABLE_TEAM_BASE_ID=appXXXqFjLgeJNRDi
AIRTABLE_TEAM_TABLE_ID=tblZKsVPjgaD7J9IG
```

**Note:** If `AIRTABLE_TEAM_*` variables are not set, the system will fall back to the base `AIRTABLE_*` variables.

### Airtable Table Schema

The TeamBoard table should have the following fields:
- `Name` (text): Twitter/X handle (e.g., `@handle`) [required]
- `X(twitter)` (text): full profile URL (e.g., `https://x.com/handle`)
- `LinkedIn` (text): full LinkedIn profile URL (optional)
- `Skillset` (multiple select): list of skills. Field allows adding new options; API will create options as needed.
- `Repo` (long text): one or more repository URLs (newline or comma separated)
# Force deployment refresh
