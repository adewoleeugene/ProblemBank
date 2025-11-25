// Server-side Airtable helper (no client-side secrets)
// Reads credentials from environment variables
// AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME, optional AIRTABLE_VIEW_NAME
// Optional mapping envs: AIRTABLE_TITLE_FIELD, AIRTABLE_BLURB_FIELD, AIRTABLE_SORT_FIELD, AIRTABLE_SORT_DIRECTION, AIRTABLE_PAGE_SIZE

export type IdeaItem = {
  id: string;
  title: string;
  blurb?: string;
  route?: string;
  order?: number;
  category?: string;
  problem?: string;
  solution?: string;
  repo?: string;
};

export type TechStackItem = {
  id: string;
  name: string;
  category: string[];
  description: string;
  url: string;
};

// Airtable multiple-select value shape can be strings or objects with a name
type AirtableSelectOption = string | { name: string };

type AirtableListResponse = {
  records: Array<{
    id: string;
    fields: Record<string, unknown>;
  }>;
  offset?: string;
};

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

function getEnv(name: string, optional = false): string | undefined {
  const v = process.env[name];
  if (!v && !optional) {
    return undefined;
  }
  return v;
}

export async function fetchFeaturedIdeas(limit = 4): Promise<IdeaItem[]> {
  const token = getEnv('AIRTABLE_TOKEN');
  const baseId = getEnv('AIRTABLE_BASE_ID');
  const tableName = getEnv('AIRTABLE_TABLE_NAME');

  if (!token || !baseId || !tableName) {
    // Return empty to let the UI fall back to placeholders
    return [];
  }

  const view = getEnv('AIRTABLE_VIEW_NAME', true);
  const filterFormula = getEnv('AIRTABLE_FILTER_FORMULA', true);
  const pageSize = parseInt(getEnv('AIRTABLE_PAGE_SIZE', true) || '10', 10);
  const sortField = getEnv('AIRTABLE_SORT_FIELD', true); // optional, no default
  const sortDirection = (getEnv('AIRTABLE_SORT_DIRECTION', true) || 'asc') as 'asc' | 'desc';

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  if (view) url.searchParams.set('view', view);

  // Add Status='Published' filter
  const statusFilter = "{Status} = 'Published'";
  const combinedFilter = filterFormula ? `AND(${statusFilter}, ${filterFormula})` : statusFilter;
  url.searchParams.set('filterByFormula', combinedFilter);

  url.searchParams.set('pageSize', String(Math.max(limit, pageSize)));
  // Sorting (only if sortField specified)
  if (sortField) {
    url.searchParams.set('sort[0][field]', sortField);
    url.searchParams.set('sort[0][direction]', sortDirection);
  }

  let data: AirtableListResponse;
  
  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 5 minutes with revalidation
      next: { 
        revalidate: 300, // 5 minutes
        tags: ['featured-ideas']
      },
    });

    if (!res.ok) {
      console.warn(`Airtable API error: ${res.status} ${res.statusText}`);
      return [];
    }
    
    data = (await res.json()) as AirtableListResponse;
  } catch (error) {
    console.warn('Failed to fetch featured ideas from Airtable:', error);
    return [];
  }

  const titleField = getEnv('AIRTABLE_TITLE_FIELD', true) || 'Title';
  const blurbField = getEnv('AIRTABLE_BLURB_FIELD', true) || 'Blurb';
  const categoryField = getEnv('AIRTABLE_CATEGORY_FIELD', true) || 'Category';
  const typeField = 'Type';
  const orderField = sortField || undefined;

  const items: IdeaItem[] = data.records.map((r) => {
    const f = r.fields || {};
    const title = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || 'Untitled Idea';
    const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';

    // Category can be a string or a multiple-select array. Use the first option when it's an array.
    const rawCategory = f[categoryField] as unknown;
    let category: string | undefined;
    if (Array.isArray(rawCategory)) {
      const arr = rawCategory as AirtableSelectOption[];
      const first = arr[0];
      if (typeof first === 'string') category = first;
      else if (first && typeof first === 'object' && 'name' in first) category = first.name;
    } else if (typeof rawCategory === 'string') {
      category = rawCategory as string;
    } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
      category = (rawCategory as { name: string }).name;
    }

    const route = (f[typeField] as string) || undefined;
    const order = orderField && typeof f[orderField] === 'number' ? (f[orderField] as number) : undefined;

    return { id: r.id, title, blurb, category, route, order };
  });

  // Sort client-side if a numeric sort field exists
  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return items.slice(0, limit);
}

export type IdeasPage = { items: IdeaItem[]; offset?: string };

// categories: optional list of category names to OR-match
// searchQuery: optional text search in title and blurb
export async function fetchIdeasPage(pageSize = 12, offset?: string, categories?: string[], searchQuery?: string): Promise<IdeasPage> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];

  if (!token || !baseId || !tableName) {
    return { items: [], offset: undefined };
  }

  // Intentionally fetch all ideas for the Ideas page (do not apply env view/filter here)
  const sortField = process.env['AIRTABLE_SORT_FIELD'];
  const sortDirection = (process.env['AIRTABLE_SORT_DIRECTION'] || 'asc') as 'asc' | 'desc';
  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  url.searchParams.set('pageSize', String(pageSize));
  if (offset) url.searchParams.set('offset', offset);
  if (sortField) {
    url.searchParams.set('sort[0][field]', sortField);
    url.searchParams.set('sort[0][direction]', sortDirection);
  }

  // Build filter formula combining categories, search, and status
  const filterParts: string[] = [];

  // Always filter by Status='Published'
  filterParts.push("{Status} = 'Published'");

  // Apply category filter if provided (multi-select OR logic)
  if (categories && categories.length > 0) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    // Test both single-select equality and multi-select inclusion via ARRAYJOIN; wrap with commas to avoid partial matches
    const joinedExpr = `"," & ARRAYJOIN({${categoryField}}, ",") & ","`;
    const perCat = categories.map((c) => `OR({${categoryField}} = '${esc(c)}', FIND("," & '${esc(c)}' & ",", ${joinedExpr}))`);
    filterParts.push(`OR(${perCat.join(',')})`);
  }

 // Apply search filter if provided (simplified to avoid formula errors)
if (searchQuery && searchQuery.trim()) {
  const esc = (s: string) => s.replace(/'/g, "\\'");
  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
  const query = esc(searchQuery.trim().toLowerCase());
  filterParts.push(`OR(FIND('${query}', LOWER({${titleField}})), FIND('${query}', LOWER({${blurbField}})))`);
}
  // Combine filters with AND logic
  const formula = filterParts.length === 1 ? filterParts[0] : `AND(${filterParts.join(',')})`;
  url.searchParams.set('filterByFormula', formula);

  let data: AirtableListResponse;
  
  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 5 minutes with revalidation
      next: { 
        revalidate: 300, // 5 minutes
        tags: ['ideas-page']
      },
    });
    
    if (!res.ok) {
      console.warn(`Airtable API error: ${res.status} ${res.statusText}`);
      return { items: [], offset: undefined };
    }
    
    data = (await res.json()) as AirtableListResponse;
  } catch (error) {
    console.warn('Failed to fetch from Airtable:', error);
    return { items: [], offset: undefined };
  }

  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
  const typeField = 'Type';
  const orderField = sortField || undefined;

  const items: IdeaItem[] = data.records.map((r) => {
    const f = r.fields || {};
    const title = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || 'Untitled Idea';
    const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';

    const rawCategory = f[categoryField] as unknown;
    let category: string | undefined;
    if (Array.isArray(rawCategory)) {
      const arr = rawCategory as AirtableSelectOption[];
      const first = arr[0];
      if (typeof first === 'string') category = first;
      else if (first && typeof first === 'object' && 'name' in first) category = (first as { name: string }).name;
    } else if (typeof rawCategory === 'string') {
      category = rawCategory as string;
    } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
      category = (rawCategory as { name: string }).name;
    }

    const route = (f[typeField] as string) || undefined;
    const order = orderField && typeof f[orderField] === 'number' ? (f[orderField] as number) : undefined;
    const repo = (f['Repo'] as string) || undefined;
    return { id: r.id, title, blurb, category, route, order, repo };
  });

  items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return { items, offset: data.offset };
}

export async function fetchIdeaByTitle(title: string): Promise<IdeaItem | null> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];

  if (!token || !baseId || !tableName) {
    return null;
  }

  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const lowerTitle = title.toLowerCase();
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
  // Filter by formula: LOWER({Title}) = 'lowercase title' AND Status='Published'
  const titleFilter = `LOWER({${titleField}}) = '${lowerTitle.replace(/'/g, "\\'")}'`;
  const statusFilter = "{Status} = 'Published'";
  url.searchParams.set('filterByFormula', `AND(${titleFilter}, ${statusFilter})`);
  url.searchParams.set('pageSize', '1');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Cache for 10 minutes with revalidation
    next: { 
      revalidate: 600, // 10 minutes
      tags: ['idea-by-title']
    },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as AirtableListResponse;
  if (!data.records?.length) return null;

  const record = data.records[0];

  const blurbField = process.env['AIRTABLE_BLURB_FIELD'] || 'Blurb';
  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
  const sortField = process.env['AIRTABLE_SORT_FIELD'];
  const typeField = 'Type';

  const f = record.fields || {};
  const mappedTitle = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || title;
  const blurb = (f[blurbField] as string) || (f['Description'] as string) || '';
  
  // Map Problem and Proposed Solution fields with safe coercion to strings
  const problemField = 'The Problem';
  const solutionField = 'Proposed Solution';
  const asText = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) {
      return (v as unknown[])
        .map((x) => (typeof x === 'string' ? x : x && typeof x === 'object' && 'name' in (x as Record<string, unknown>) ? (x as { name?: string }).name ?? '' : ''))
        .filter(Boolean)
        .join(', ');
    }
    return '';
  };
  const problem = asText(f[problemField]);
  const solution = asText(f[solutionField]);

  const rawCategory = f[categoryField] as unknown;
  let category: string | undefined;
  if (Array.isArray(rawCategory)) {
    const arr = rawCategory as AirtableSelectOption[];
    const first = arr[0];
    if (typeof first === 'string') category = first;
    else if (first && typeof first === 'object' && 'name' in first) category = (first as { name: string }).name;
  } else if (typeof rawCategory === 'string') {
    category = rawCategory as string;
  } else if (rawCategory && typeof rawCategory === 'object' && 'name' in (rawCategory as Record<string, unknown>)) {
    category = (rawCategory as { name: string }).name;
  }

  const route = (f[typeField] as string) || undefined;
  const order = sortField && typeof f[sortField] === 'number' ? (f[sortField] as number) : undefined;
  const repo = (f['Repo'] as string) || undefined;

  return { id: record.id, title: mappedTitle, blurb, category, route, order, problem, solution, repo };
}

// Fetch distinct category values from the table (dynamic chips)
export async function fetchAllCategories(maxPages = 10): Promise<string[]> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];
  if (!token || !baseId || !tableName) return [];

  const categoryField = process.env['AIRTABLE_CATEGORY_FIELD'] || 'Category';
  const seen = new Set<string>();
  let offset: string | undefined = undefined;
  let pages = 0;

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    // Request only the category field to minimize payload
    url.searchParams.append('fields[]', categoryField);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 15 minutes with revalidation
      next: { 
        revalidate: 900, // 15 minutes
        tags: ['categories']
      },
    });
    if (!res.ok) break;
    const data = (await res.json()) as AirtableListResponse;

    for (const r of data.records) {
      const f = r.fields || {};
      const raw = f[categoryField] as unknown;
      if (!raw) continue;
      if (Array.isArray(raw)) {
        for (const v of raw as AirtableSelectOption[]) {
          if (typeof v === 'string') seen.add(v);
          else if (v && typeof v === 'object' && 'name' in v) seen.add((v as { name: string }).name);
        }
      } else if (typeof raw === 'string') {
        seen.add(raw);
      } else if (raw && typeof raw === 'object' && 'name' in (raw as Record<string, unknown>)) {
        seen.add((raw as { name: string }).name);
      }
    }

    offset = data.offset;
    pages += 1;
    if (!offset) break;
  }

  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

// Helper to generate slugs consistently with ideas/page.tsx
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Robust fetch by slug: iterate pages and match by slugified title
export async function fetchIdeaBySlug(slug: string): Promise<IdeaItem | null> {
  // Try up to 10 pages of 50 items each
  let offset: string | undefined = undefined;
  for (let i = 0; i < 10; i++) {
    const page = await fetchIdeasPage(50, offset);
    for (const item of page.items) {
      if (slugifyTitle(item.title) === slug) {
        // Enrich with problem/solution via exact title fetch
        const enriched = await fetchIdeaByTitle(item.title);
        return enriched ?? { ...item };
      }
    }
    if (!page.offset) break;
    offset = page.offset;
  }
  return null;
}

// Tech Stack functions
export async function fetchTechStacks(pageSize = 12, offset?: string, categories?: string[], searchQuery?: string): Promise<{ items: TechStackItem[]; offset?: string }> {
  const token = process.env['AIRTABLE_TECH_TOKEN'] || process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_TECH_BASE_ID'] || process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TECH_TABLE_NAME'] || 'Tech Stack';
  const tableId = process.env['AIRTABLE_TECH_TABLE_ID'];

  if (!token || !baseId || (!tableName && !tableId)) {
    return { items: [], offset: undefined };
  }

  const nameField = process.env['AIRTABLE_TECH_NAME_FIELD'] || 'Name';
  const categoryField = process.env['AIRTABLE_TECH_CATEGORY_FIELD'] || 'Category';
  const descField = process.env['AIRTABLE_TECH_DESC_FIELD'] || 'Tech Description';
  const urlField = process.env['AIRTABLE_TECH_URL_FIELD'] || 'Website/Docs URL';

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId || tableName)}`);
  url.searchParams.set('pageSize', String(pageSize));
  if (offset) url.searchParams.set('offset', offset);

  // Build filter formula combining categories and search
  const filterParts: string[] = [];
  
  // Apply category filter if provided (multi-select OR logic)
  if (categories && categories.length > 0) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    const perCat = categories.map((c) => 
      `OR({${categoryField}} = '${esc(c)}', FIND('${esc(c)}', ARRAYJOIN({${categoryField}})))`
    );
    filterParts.push(`OR(${perCat.join(',')})`);
  }
  
  // Apply search filter if provided
  if (searchQuery && searchQuery.trim()) {
    const esc = (s: string) => s.replace(/'/g, "\\'");
    const query = esc(searchQuery.trim().toLowerCase());
    filterParts.push(`OR(FIND('${query}', LOWER({${nameField}})), FIND('${query}', LOWER({${descField}})))`);
  }
  
  // Combine filters with AND logic
  if (filterParts.length > 0) {
    const formula = filterParts.length === 1 ? filterParts[0] : `AND(${filterParts.join(',')})`;
    url.searchParams.set('filterByFormula', formula);
    console.log('Tech Stack Filter Formula:', formula);
  }
  
  console.log('Tech Stack API URL:', url.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    // Cache for 5 minutes with revalidation
    next: { 
      revalidate: 300, // 5 minutes
      tags: ['tech-stacks']
    },
  });
  
  if (!res.ok) {
    console.error('Airtable API error:', res.status, res.statusText);
    try {
      const errorBody = await res.text();
      console.error('Airtable API error body:', errorBody);
    } catch (e) {
      console.error('Could not read error response body:', e);
    }
    return { items: [], offset: undefined };
  }

  const data = (await res.json()) as AirtableListResponse;
  console.log('Fetched tech stacks:', data.records.length, 'records');

  const items: TechStackItem[] = data.records.map((r) => {
    const f = r.fields || {};
    const name = (f[nameField] as string) || 'Untitled';
    const description = (f[descField] as string) || '';
    const url = (f[urlField] as string) || '';

    // Handle multi-select categories
    const rawCategory = f[categoryField] as unknown;
    let category: string[] = [];
    if (Array.isArray(rawCategory)) {
      category = (rawCategory as AirtableSelectOption[]).map(c => 
        typeof c === 'string' ? c : (c && typeof c === 'object' && 'name' in c ? (c as { name: string }).name : '')
      ).filter(Boolean);
    } else if (typeof rawCategory === 'string') {
      category = [rawCategory];
    }

    const item = { id: r.id, name, category, description, url };
    console.log('Tech stack item:', item.name, 'categories:', item.category);
    return item;
  });

  console.log('Total items returned:', items.length);
  return { items, offset: data.offset };
}

export async function fetchAllTechCategories(maxPages = 10): Promise<string[]> {
  const token = process.env['AIRTABLE_TECH_TOKEN'] || process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_TECH_BASE_ID'] || process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TECH_TABLE_NAME'] || 'Tech Stack';
  const tableId = process.env['AIRTABLE_TECH_TABLE_ID'];
  
  if (!token || !baseId || (!tableName && !tableId)) return [];

  const categoryField = process.env['AIRTABLE_TECH_CATEGORY_FIELD'] || 'Category';
  const seen = new Set<string>();
  let offset: string | undefined = undefined;
  let pages = 0;

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableId || tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    url.searchParams.append('fields[]', categoryField);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 15 minutes with revalidation
      next: { 
        revalidate: 900, // 15 minutes
        tags: ['tech-categories']
      },
    });
    if (!res.ok) {
      console.error('Airtable categories API error:', res.status, res.statusText);
      try {
        const errorBody = await res.text();
        console.error('Airtable categories error body:', errorBody);
      } catch (e) {
        console.error('Could not read categories error response body:', e);
      }
      break;
    }
    const data = (await res.json()) as AirtableListResponse;

    for (const r of data.records) {
      const f = r.fields || {};
      const raw = f[categoryField] as unknown;
      if (!raw) continue;
      if (Array.isArray(raw)) {
        for (const v of raw as AirtableSelectOption[]) {
          if (typeof v === 'string' && v.trim()) seen.add(v.trim());
          else if (v && typeof v === 'object' && 'name' in v && (v as { name: string }).name?.trim()) {
            seen.add((v as { name: string }).name.trim());
          }
        }
      } else if (typeof raw === 'string' && raw.trim()) {
        seen.add(raw.trim());
      }
    }

    offset = data.offset;
    pages += 1;
    if (!offset) break;
  }

  return Array.from(seen).sort((a, b) => a.localeCompare(b));
}

// Fetch all ideas with minimal data for navigation purposes
export async function fetchAllIdeasMinimal(): Promise<Array<{ id: string; title: string; slug: string }>> {
  const token = process.env['AIRTABLE_TOKEN'];
  const baseId = process.env['AIRTABLE_BASE_ID'];
  const tableName = process.env['AIRTABLE_TABLE_NAME'];

  if (!token || !baseId || !tableName) {
    return [];
  }

  const sortField = process.env['AIRTABLE_SORT_FIELD'];
  const sortDirection = (process.env['AIRTABLE_SORT_DIRECTION'] || 'asc') as 'asc' | 'desc';
  const titleField = process.env['AIRTABLE_TITLE_FIELD'] || 'Title';
  const orderField = sortField || undefined;

  const allIdeas: Array<{ id: string; title: string; slug: string }> = [];
  let offset: string | undefined = undefined;
  let pages = 0;
  const maxPages = 20; // Reasonable limit to prevent infinite loops

  while (pages < maxPages) {
    const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);
    // Add Status='Published' filter
    url.searchParams.set('filterByFormula', "{Status} = 'Published'");
    if (sortField) {
      url.searchParams.set('sort[0][field]', sortField);
      url.searchParams.set('sort[0][direction]', sortDirection);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 5 minutes with revalidation
      next: { 
        revalidate: 300, // 5 minutes
        tags: ['all-ideas-minimal']
      },
    });

    if (!res.ok) {
      console.warn(`Airtable API error: ${res.status} ${res.statusText}`);
      break;
    }

    const data = (await res.json()) as AirtableListResponse;

    for (const r of data.records) {
      const f = r.fields || {};
      const title = (f[titleField] as string) || (f['Name'] as string) || (f['Idea'] as string) || 'Untitled Idea';
      const slug = slugifyTitle(title);
      
      allIdeas.push({
        id: r.id,
        title,
        slug
      });
    }

    offset = data.offset;
    pages += 1;
    if (!offset) break;
  }

  // Sort client-side if a numeric sort field exists
  if (orderField) {
    allIdeas.sort((a, b) => {
      // This is a simplified sort - in practice, we'd need to fetch the order field
      // For now, we'll rely on the server-side sort from Airtable
      return 0;
    });
  }

  return allIdeas;
}