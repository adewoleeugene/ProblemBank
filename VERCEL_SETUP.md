# Vercel Environment Variables Setup Guide

## Issue: Ideas Show Locally but NOT on Vercel

This means your `.env.local` file works, but Vercel doesn't have the environment variables.

## Step-by-Step Fix

### Step 1: Go to Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Click on your project (ProblemBank)
3. Click "Settings" tab at the top

### Step 2: Add Environment Variables

1. In Settings, click "Environment Variables" in the left sidebar
2. For EACH variable below, click "Add New"
3. Enter the variable name and value
4. Select ALL environments: Production, Preview, Development
5. Click "Save"

### Environment Variables to Add

**CRITICAL - Required for ideas to show:**

| Variable Name | Value |
|---------------|-------|
| `AIRTABLE_TOKEN` | Copy from `.env.local` |
| `AIRTABLE_BASE_ID` | Copy from `.env.local` |
| `AIRTABLE_TABLE_NAME` | `Idea Bank` |
| `AIRTABLE_TABLE_ID` | Copy from `.env.local` |

**Field Mappings (Important):**

| Variable Name | Value |
|---------------|-------|
| `AIRTABLE_TITLE_FIELD` | `Idea Title` |
| `AIRTABLE_BLURB_FIELD` | `The Problem` |
| `AIRTABLE_CATEGORY_FIELD` | `Category` |

**Optional (can leave empty):**

| Variable Name | Value (leave blank) |
|---------------|---------------------|
| `AIRTABLE_SORT_FIELD` | *(empty)* |
| `AIRTABLE_VIEW_NAME` | *(empty)* |
| `AIRTABLE_FILTER_FORMULA` | *(empty)* |

**Tech Stack (use main credentials):**

| Variable Name | Value (leave blank to use main) |
|---------------|----------------------------------|
| `AIRTABLE_TECH_TOKEN` | *(empty - will use AIRTABLE_TOKEN)* |
| `AIRTABLE_TECH_BASE_ID` | *(empty - will use AIRTABLE_BASE_ID)* |
| `AIRTABLE_TECH_TABLE_NAME` | `Tech Stack` |

### Step 3: Redeploy

**After adding ALL variables:**

1. Go to "Deployments" tab
2. Click the "..." menu on the latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache" (faster)
5. Click "Redeploy"

**OR** just push a new commit:
```bash
git add .
git commit -m "Trigger redeploy"
git push
```

### Step 4: Test the Deployment

**After redeployment completes (2-3 minutes):**

1. Visit your site: `https://your-site.vercel.app`
2. Check if ideas show on homepage
3. Visit `/ideas` page

**Diagnostic Endpoint:**

Visit: `https://your-site.vercel.app/api/debug`

This will show:
- ✅ Which environment variables are set
- ✅ If Airtable connection works
- ❌ Any errors or missing configuration

**Expected Response:**
```json
{
  "config": {
    "hasToken": true,
    "hasBaseId": true,
    "hasTableName": true,
    "tokenPreview": "patQsQ0dpY...",
    "baseIdPreview": "applyc2I..."
  },
  "apiTest": {
    "success": true,
    "recordCount": 1,
    "error": null
  }
}
```

**If you see errors:**
- `hasToken: false` → AIRTABLE_TOKEN not set in Vercel
- `hasBaseId: false` → AIRTABLE_BASE_ID not set in Vercel
- `recordCount: 0` → No records with Status='Published' in Airtable
- `apiTest.error` → Check the error message for details

### Step 5: Verify Airtable Has "Status" Field

**CRITICAL:** Your Airtable records MUST have Status='Published'

1. Open Airtable: https://airtable.com
2. Go to your "Idea Bank" table
3. Check if there's a "Status" column
4. If NOT:
   - Add a new column called "Status"
   - Type: Single select
   - Add option: "Published"
5. Set ALL visible ideas to Status="Published"

### Common Issues

#### Issue: Variables look correct but still no ideas

**Solution:** Clear Vercel cache
1. Vercel Dashboard → Settings → General
2. Scroll to "Build & Development Settings"
3. Click "Clear Build Cache and Redeploy"

#### Issue: Getting "INVALID_REQUEST_BODY" or "NOT_AUTHORIZED"

**Solution:** Check token validity
- Token might be expired or revoked
- Regenerate a new Personal Access Token in Airtable:
  1. Airtable Account → Developer Hub → Personal Access Tokens
  2. Create new token with `data.records:read` scope
  3. Add to Vercel environment variables
  4. Redeploy

#### Issue: Some fields show "Untitled Idea" or empty

**Solution:** Field name mismatch
- Make sure Airtable column names EXACTLY match:
  - `Idea Title` (not "Title" or "Idea")
  - `The Problem` (not "Problem" or "Blurb")
  - `Category` (exact match)
  - `Status` (exact match)

### Quick Checklist

- [ ] All environment variables added to Vercel
- [ ] Variables set for all environments (Production, Preview, Development)
- [ ] Airtable has "Status" column
- [ ] Ideas set to Status="Published"
- [ ] Redeployed after adding variables
- [ ] Tested `/api/debug` endpoint
- [ ] Cleared build cache if needed

### Still Not Working?

1. Check Vercel function logs:
   - Deployments → Click deployment → Functions tab
   - Look for errors in `/api/ideas` function

2. Check browser console:
   - Open your deployed site
   - Press F12 → Console tab
   - Look for failed fetch requests to `/api/ideas`

3. Test API directly:
   - Visit: `https://your-site.vercel.app/api/ideas?pageSize=10`
   - Should return JSON with ideas array
   - If `{"items":[]}` → Airtable issue (Status field or env vars)
   - If error → Check the error message

### Next Steps

After fixing the environment variables:
- Ideas should appear on homepage
- Ideas page should show full list
- Categories should work
- Search should work

If problems persist, share the output from `/api/debug` endpoint.
