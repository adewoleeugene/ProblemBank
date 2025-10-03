import { NextResponse } from 'next/server';
import { fetchIdeasPage } from '../../../lib/airtable';

// Supports pagination via query params: pageSize, offset, categories (CSV)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSizeParam = searchParams.get('pageSize');
    const offset = searchParams.get('offset') || undefined;
    const pageSize = pageSizeParam ? Math.max(1, Math.min(50, parseInt(pageSizeParam, 10))) : 16;

    // Parse CSV categories if provided
    const categoriesCsv = searchParams.get('categories') || '';
    const categories = categoriesCsv
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Parse search query if provided
    const searchQuery = searchParams.get('q') || undefined;

    const { items, offset: nextOffset } = await fetchIdeasPage(pageSize, offset, categories.length ? categories : undefined, searchQuery);
    return NextResponse.json({ items, offset: nextOffset }, { status: 200 });
  } catch (e) {
    console.error('Failed to fetch ideas:', e);
    // Return empty list with 200 so UI can fallback gracefully
    return NextResponse.json({ items: [], offset: undefined, error: 'Failed to fetch ideas' }, { status: 200 });
  }
}