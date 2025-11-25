# Vercel Deployment Checklist

## Issue: Ideas Not Showing on Vercel

### Root Cause
The application filters ALL ideas by `{Status} = 'Published'`. If your Airtable records don't have this field/value, NO ideas will display.

### Solution Steps

#### 1. Check Your Airtable "Idea Bank" Table

**Required Fields:**
- `Status` - **CRITICAL**: Single select field with value "Published" for visible ideas
- `Idea Title` - Your idea title
- `The Problem` - Problem description
- `Category` - Idea category
- `Type` - Optional routing type
- `Proposed Solution` - Solution description
- `Repo` - Optional repository URL

**Status Field Setup:**
1. Open your Airtable "Idea Bank" table
2. Add a column called "Status" (Single select type)
3. Add option "Published"
4. Set ALL ideas you want to display to "Published"

Without this, the filter `{Status} = 'Published'` will return 0 results.

#### 2. Verify Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Copy these from your `.env.local` file:

```
AIRTABLE_TOKEN=<copy from .env.local>
AIRTABLE_BASE_ID=<copy from .env.local>
AIRTABLE_TABLE_NAME=Idea Bank
AIRTABLE_TABLE_ID=<copy from .env.local>
AIRTABLE_SORT_FIELD=
AIRTABLE_SORT_DIRECTION=asc
AIRTABLE_CATEGORY_FIELD=Category
AIRTABLE_TITLE_FIELD=Idea Title
AIRTABLE_BLURB_FIELD=The Problem
AIRTABLE_VIEW_NAME=
AIRTABLE_FILTER_FORMULA=
AIRTABLE_PAGE_SIZE=10
```

**Tech Stack Variables (use same Airtable base):**
```
AIRTABLE_TECH_TOKEN=
AIRTABLE_TECH_BASE_ID=
AIRTABLE_TECH_TABLE_NAME=Tech Stack
AIRTABLE_TECH_TABLE_ID=
AIRTABLE_TECH_NAME_FIELD=Name
AIRTABLE_TECH_CATEGORY_FIELD=Category
AIRTABLE_TECH_DESC_FIELD=Tech Description
AIRTABLE_TECH_URL_FIELD=Website/Docs URL
```

**Note:** Empty values (AIRTABLE_TECH_TOKEN, AIRTABLE_TECH_BASE_ID) will fall back to main Airtable credentials.

#### 3. Redeploy After Adding Status Field

After adding the "Status" field and setting records to "Published":
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click "..." on latest deployment
4. Click "Redeploy"

Or push a new commit to trigger deployment.

#### 4. Check Vercel Deployment Logs

If ideas still don't show:
1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Click "Functions" tab
4. Check for any API errors related to `/api/ideas`

Common errors:
- `AIRTABLE_TOKEN` not set or invalid
- `AIRTABLE_BASE_ID` not set or invalid
- Airtable API rate limiting (unlikely)
- Network/CORS issues (unlikely with Next.js API routes)

#### 5. Test Locally vs Production

**Local works but Vercel doesn't?**
- Environment variables not synced to Vercel
- Status field missing in Airtable (local might have different data)
- Cached build on Vercel

**Solution:** Clear Vercel cache:
```bash
# In Vercel Dashboard:
Settings → General → Clear Build Cache and Redeploy
```

### Quick Test

Visit these URLs on your deployed site:
- `https://your-site.vercel.app/api/ideas` - Should return JSON with ideas array
- If returns `{"items":[],"offset":null}` → Status field issue or env vars not set
- If returns error → Check Vercel function logs

### Field Mapping Reference

| Airtable Field | Environment Variable | Default Value |
|---|---|---|
| Status | (hardcoded filter) | "Published" |
| Idea Title | AIRTABLE_TITLE_FIELD | "Title" |
| The Problem | AIRTABLE_BLURB_FIELD | "Blurb" |
| Category | AIRTABLE_CATEGORY_FIELD | "Category" |
| Proposed Solution | (hardcoded) | "Proposed Solution" |
| Repo | (hardcoded) | "Repo" |
| Type | (hardcoded) | "Type" |

### Need Help?

Check Vercel logs:
```bash
vercel logs your-project-name --follow
```

Or check the browser console on your deployed site for API errors.
