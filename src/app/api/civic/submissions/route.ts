import { NextResponse } from 'next/server';

const AIRTABLE_API_BASE = 'https://api.airtable.com/v0';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'category', 'phone', 'ideaTitle', 'submissionLink', 'presentationVideo', 'productDescription'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Check if before deadline (Dec 12 noon GMT)
    const submissionDeadline = new Date('2025-12-12T12:00:00Z');
    const now = new Date();
    if (now >= submissionDeadline) {
      return NextResponse.json({ error: 'Submission deadline has passed' }, { status: 400 });
    }

    // Get Airtable credentials from environment
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_CIVIC_SUBMISSIONS_BASE_ID || process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_CIVIC_SUBMISSIONS_TABLE_ID;

    if (!token || !baseId || !tableId) {
      console.error('Missing Airtable credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create record in Airtable
    const airtableData = {
      fields: {
        'Name': body.name,
        'Email': body.email,
        'Category': body.category,
        'Phone': body.phone,
        'Idea Title': body.ideaTitle,
        'Team Name': body.teamName,
        'Team Members': body.teamMembers,
        'Link to Submission': body.submissionLink,
        'Presentation Video': body.presentationVideo || '',
        'Product Description': body.productDescription,
      },
    };

    const url = `${AIRTABLE_API_BASE}/${baseId}/${tableId}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(airtableData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', response.status, errorText);
      console.error('Submitted data:', JSON.stringify(airtableData, null, 2));
      return NextResponse.json(
        { error: `Failed to submit to Airtable: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ success: true, id: result.id }, { status: 201 });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Check if current time is between Dec 12 noon and midnight GMT
    const displayStart = new Date('2025-12-12T12:00:00Z');
    const displayEnd = new Date('2025-12-13T00:00:00Z');
    const now = new Date();

    // For testing purposes, allow viewing during development
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!isDevelopment && (now < displayStart || now >= displayEnd)) {
      return NextResponse.json({ items: [], message: 'Submissions are not visible at this time' }, { status: 200 });
    }

    // Get Airtable credentials
    const token = process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_CIVIC_SUBMISSIONS_BASE_ID || process.env.AIRTABLE_BASE_ID;
    const tableId = process.env.AIRTABLE_CIVIC_SUBMISSIONS_TABLE_ID;

    if (!token || !baseId || !tableId) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const url = `${AIRTABLE_API_BASE}/${baseId}/${tableId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60, // Revalidate every minute during display window
      },
    });

    if (!response.ok) {
      console.error('Airtable API error:', response.status);
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const data = await response.json();

    const items = data.records.map((record: any) => ({
      id: record.id,
      name: record.fields['Name'] || '',
      email: record.fields['Email'] || '',
      category: record.fields['Category'] || '',
      phone: record.fields['Phone'] || '',
      ideaTitle: record.fields['Idea Title'] || '',
      teamName: record.fields['Team Name'] || '',
      teamMembers: record.fields['Team Members'] || '',
      submissionLink: record.fields['Link to Submission'] || '',
      presentationVideo: record.fields['Presentation Video'] || '',
      productDescription: record.fields['Product Description'] || '',
      submittedAt: record.fields['Submitted At'] || '',
    }));

    return NextResponse.json({ items }, { status: 200 });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
