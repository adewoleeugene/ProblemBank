import { NextRequest, NextResponse } from 'next/server';
import { fetchTechStacks } from '@/lib/airtable';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
    const offset = searchParams.get('offset') || undefined;
    const searchQuery = searchParams.get('q') || undefined;
    const categoriesParam = searchParams.get('categories');
    const categories = categoriesParam ? categoriesParam.split(',') : undefined;

    const result = await fetchTechStacks(pageSize, offset, categories, searchQuery);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return NextResponse.json({ items: [], offset: undefined }, { status: 500 });
  }
}
