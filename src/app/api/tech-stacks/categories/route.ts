import { NextResponse } from 'next/server';
import { fetchAllTechCategories } from '@/lib/airtable';

export async function GET() {
  try {
    const categories = await fetchAllTechCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching tech categories:', error);
    return NextResponse.json([], { status: 500 });
  }
}
