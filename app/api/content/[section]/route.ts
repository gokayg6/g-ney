import { NextRequest, NextResponse } from 'next/server';
import { getData, saveData, PortfolioData } from '@/lib/data';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const data = getData();
    const section = params.section;
    
    // Special handling for array sections
    if (section === 'social' || section === 'subdomainProjects') {
      return NextResponse.json((data as any)[section] || [], {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
    
    const sectionKey = section as keyof PortfolioData;
    if (!(sectionKey in data)) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data[sectionKey], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    // Verify authentication
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = getData();
    const section = params.section as keyof PortfolioData;
    const sectionData = await request.json();

    // Special handling for array sections
    if (section === 'social' || section === 'subdomainProjects') {
      if (!Array.isArray(sectionData)) {
        return NextResponse.json(
          { error: `${section} section must be an array` },
          { status: 400 }
        );
      }
      (data as any)[section] = sectionData;
    } else {
      if (!(section in data)) {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }
      (data as any)[section] = sectionData;
    }

    saveData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving section:', error);
    return NextResponse.json(
      { error: 'Failed to save section' },
      { status: 500 }
    );
  }
}

