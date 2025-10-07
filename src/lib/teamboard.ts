// TeamBoard Airtable helpers
// Reads credentials from environment variables
// AIRTABLE_TEAM_TOKEN, AIRTABLE_TEAM_BASE_ID, AIRTABLE_TEAM_TABLE_ID
// Falls back to base AIRTABLE_* if TEAM_* not set

export type TeamProfile = {
  id: string;
  handle: string;
  twitterUrl: string;
  linkedinUrl?: string;
  skills: string[];
  repos: string[];
  createdAt?: string;
  clientIp?: string;
};

type AirtableSelectOption = string | { name: string };

type AirtableListResponse = {
  records: Array<{
    id: string;
    fields: Record<string, unknown>;
    createdTime?: string;
  }>;
  offset?: string;
};

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

function getEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] || fallback;
}

export async function listTeamProfiles(limit = 50): Promise<TeamProfile[]> {
  const token = getEnv('AIRTABLE_TEAM_TOKEN', process.env['AIRTABLE_TOKEN']);
  const baseId = getEnv('AIRTABLE_TEAM_BASE_ID', process.env['AIRTABLE_BASE_ID']);
  const tableId = getEnv('AIRTABLE_TEAM_TABLE_ID', process.env['AIRTABLE_TABLE_ID']);

  if (!token || !baseId || !tableId) {
    console.warn('Missing Airtable credentials for TeamBoard');
    return [];
  }

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${tableId}`);
  url.searchParams.set('pageSize', String(limit));
  // Remove sorting since we don't have a Created time field
  // url.searchParams.set('sort[0][field]', 'Created time');
  // url.searchParams.set('sort[0][direction]', 'desc');

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Airtable API error:', res.status, res.statusText, errorText);
    return [];
  }

  const data = (await res.json()) as AirtableListResponse;

  const profiles: TeamProfile[] = data.records.map((r) => {
    const f = r.fields || {};
    
    // Debug: log available fields
    console.log('Available fields:', Object.keys(f));
    
    // Handle Twitter/X fields
    const name = (f['Name'] as string) || '';
    const twitterUrl = (f['X(twitter)'] as string) || '';
    
    // LinkedIn - try different field names
    const linkedinUrl = (f['LinkedIn'] as string) || (f['Linkedin'] as string) || undefined;
    
    // Skillset (multi-select)
    const rawSkills = f['Skillset'] as unknown;
    let skills: string[] = [];
    if (Array.isArray(rawSkills)) {
      skills = (rawSkills as AirtableSelectOption[]).map(s => 
        typeof s === 'string' ? s : (s && typeof s === 'object' && 'name' in s ? (s as { name: string }).name : '')
      ).filter(Boolean);
    } else if (typeof rawSkills === 'string') {
      skills = [rawSkills];
    }
    
    // Repos (long text, split by newlines/commas)
    const rawRepos = (f['Repo'] as string) || '';
    const repos = rawRepos
      .split(/[\n,]/)
      .map(r => r.trim())
      .filter(r => r && (r.startsWith('http://') || r.startsWith('https://')));

    // Client IP (if stored in Airtable)
    const clientIp = (f['Client IP'] as string) || undefined;

        return {
          id: r.id,
          handle: name,
          twitterUrl,
          linkedinUrl,
          skills,
          repos,
          createdAt: new Date().toISOString(), // Use current time since we don't have a Created time field
          clientIp,
        };
  });

  return profiles;
}

export async function createTeamProfile(input: {
  handle: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  skills: string[];
  repos: string[];
  clientIp?: string;
}): Promise<{ id: string }> {
  const token = getEnv('AIRTABLE_TEAM_TOKEN', process.env['AIRTABLE_TOKEN']);
  const baseId = getEnv('AIRTABLE_TEAM_BASE_ID', process.env['AIRTABLE_BASE_ID']);
  const tableId = getEnv('AIRTABLE_TEAM_TABLE_ID', process.env['AIRTABLE_TABLE_ID']);

  console.log('Airtable credentials check:', {
    hasToken: !!token,
    hasBaseId: !!baseId,
    hasTableId: !!tableId,
    tokenLength: token?.length || 0,
    baseIdValue: baseId,
    tableIdValue: tableId
  });

  if (!token || !baseId || !tableId) {
    throw new Error(`Missing Airtable credentials for TeamBoard. Token: ${!!token}, BaseId: ${!!baseId}, TableId: ${!!tableId}`);
  }

  // Normalize handle to @format
  const handle = input.handle.startsWith('@') ? input.handle : `@${input.handle}`;
  
  // Build Twitter URL if not provided
  const twitterUrl = input.twitterUrl || `https://x.com/${handle.replace('@', '')}`;

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${tableId}`);
  
      const record = {
        fields: {
          'Name': handle,
          'X(twitter)': twitterUrl,
          'LinkedIn': input.linkedinUrl || '',
          'Skillset': input.skills.filter(skill => skill.trim().length > 0), // Filter out empty skills
          'Repo': input.repos.join('\n'),
          'Client IP': input.clientIp || '',
        },
      };

  console.log('Sending to Airtable:', JSON.stringify(record, null, 2));

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return { id: data.id };
}

export async function deleteTeamProfile(recordId: string): Promise<void> {
  const token = getEnv('AIRTABLE_TEAM_TOKEN', process.env['AIRTABLE_TOKEN']);
  const baseId = getEnv('AIRTABLE_TEAM_BASE_ID', process.env['AIRTABLE_BASE_ID']);
  const tableId = getEnv('AIRTABLE_TEAM_TABLE_ID', process.env['AIRTABLE_TABLE_ID']);

  if (!token || !baseId || !tableId) {
    throw new Error(`Missing Airtable credentials for TeamBoard. Token: ${!!token}, BaseId: ${!!baseId}, TableId: ${!!tableId}`);
  }

  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${tableId}/${recordId}`);

  const res = await fetch(url.toString(), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable API error: ${res.status} ${error}`);
  }
}

export async function getTeamProfile(recordId: string): Promise<TeamProfile> {
  const token = getEnv('AIRTABLE_TEAM_TOKEN', process.env['AIRTABLE_TOKEN']);
  const baseId = getEnv('AIRTABLE_TEAM_BASE_ID', process.env['AIRTABLE_BASE_ID']);
  const tableId = getEnv('AIRTABLE_TEAM_TABLE_ID', process.env['AIRTABLE_TABLE_ID']);

  if (!token || !baseId || !tableId) {
    throw new Error(`Missing Airtable credentials for TeamBoard. Token: ${!!token}, BaseId: ${!!baseId}, TableId: ${!!tableId}`);
  }

  // Use the correct Airtable API endpoint for fetching a single record
  const url = new URL(`${AIRTABLE_API_BASE}/${baseId}/${tableId}/${recordId}`);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Airtable API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  const record = data;
  
  if (!record || !record.id) {
    throw new Error('Profile not found');
  }

  const f = record.fields || {};
  
  // Handle Twitter/X fields
  const name = (f['Name'] as string) || '';
  const twitterUrl = (f['X(twitter)'] as string) || '';
  
  // LinkedIn
  const linkedinUrl = (f['LinkedIn'] as string) || undefined;
  
  // Skillset (multi-select)
  const rawSkills = f['Skillset'] as unknown;
  let skills: string[] = [];
  if (Array.isArray(rawSkills)) {
    skills = (rawSkills as AirtableSelectOption[]).map(s => 
      typeof s === 'string' ? s : (s && typeof s === 'object' && 'name' in s ? (s as { name: string }).name : '')
    ).filter(Boolean);
  } else if (typeof rawSkills === 'string') {
    skills = [rawSkills];
  }
  
  // Repos (long text, split by newlines/commas)
  const rawRepos = (f['Repo'] as string) || '';
  const repos = rawRepos
    .split(/[\n,]/)
    .map(r => r.trim())
    .filter(r => r && (r.startsWith('http://') || r.startsWith('https://')));

  // Client IP (if stored in Airtable)
  const clientIp = (f['Client IP'] as string) || undefined;

  return {
    id: record.id,
    handle: name,
    twitterUrl,
    linkedinUrl,
    skills,
    repos,
    createdAt: new Date().toISOString(),
    clientIp,
  };
}

// Helper to normalize Twitter handle from various formats
export function normalizeTwitterHandle(input: string): { handle: string; url: string } {
  // Remove @ if present
  let handle = input.replace(/^@/, '');
  
  // Extract from URLs
  const urlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?(?:x\.com|twitter\.com)\/([^\/\?]+)/);
  if (urlMatch) {
    handle = urlMatch[1];
  }
  
  return {
    handle: `@${handle}`,
    url: `https://x.com/${handle}`,
  };
}

// Helper to validate LinkedIn URL
export function validateLinkedInUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('linkedin.com');
  } catch {
    return false;
  }
}
