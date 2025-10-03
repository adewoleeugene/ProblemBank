import { NextRequest, NextResponse } from 'next/server';
import { listTeamProfiles, createTeamProfile, normalizeTwitterHandle, validateLinkedInUrl } from '@/lib/teamboard';

export async function GET(request: NextRequest) {
  try {
    const profiles = await listTeamProfiles();
    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Error fetching team profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { twitter, linkedin, skills, repos } = body;
    
    // Validate required fields
    if (!twitter || !twitter.trim()) {
      return NextResponse.json(
        { error: 'Twitter handle is required' },
        { status: 400 }
      );
    }
    
    // Normalize Twitter handle
    const { handle, url: twitterUrl } = normalizeTwitterHandle(twitter);
    
    // Validate LinkedIn if provided
    if (linkedin && linkedin.trim()) {
      if (!validateLinkedInUrl(linkedin)) {
        return NextResponse.json(
          { error: 'Invalid LinkedIn URL' },
          { status: 400 }
        );
      }
    }
    
    // Normalize skills to array
    let skillsArray: string[] = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills.map(s => s.trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    // Normalize repos to array
    let reposArray: string[] = [];
    if (repos) {
      if (Array.isArray(repos)) {
        reposArray = repos.map(r => r.trim()).filter(Boolean);
      } else if (typeof repos === 'string') {
        reposArray = repos.split(/[\n,]/).map(r => r.trim()).filter(Boolean);
      }
    }
    
    // Validate repo URLs
    reposArray = reposArray.filter(r => {
      try {
        new URL(r);
        return r.startsWith('http://') || r.startsWith('https://');
      } catch {
        return false;
      }
    });
    
    // Create profile
    const result = await createTeamProfile({
      handle,
      twitterUrl,
      linkedinUrl: linkedin?.trim() || undefined,
      skills: skillsArray,
      repos: reposArray,
    });
    
    return NextResponse.json({ id: result.id, success: true });
    
  } catch (error) {
    console.error('Error creating team profile:', error);
    
    // Provide more specific error information
    let errorMessage = 'Failed to create profile';
    if (error instanceof Error) {
      if (error.message.includes('Missing Airtable credentials')) {
        errorMessage = 'Airtable configuration error. Please check environment variables.';
      } else if (error.message.includes('Airtable API error')) {
        errorMessage = 'Airtable API error. Please check your table configuration.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
