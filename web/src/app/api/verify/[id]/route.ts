import { NextResponse } from 'next/server';

// Mock database (replace with real database in production)
const users = [
  // This would be populated from your actual data source
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // In a real app, fetch from database
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Resident not found' },
        { status: 404 }
      );
    }
    
    // Return only public information
    const publicInfo = {
      id: user.id,
      fullName: user.fullName,
      country: user.country,
      residencyType: user.residencyType || 'Bhutan',
      status: user.status,
      issuedAt: user.createdAt
    };
    
    return NextResponse.json(publicInfo);
    
  } catch (error) {
    console.error('Error fetching resident:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resident information' },
      { status: 500 }
    );
  }
}
