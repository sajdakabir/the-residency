import { NextResponse } from 'next/server';

// Mock database (replace with real database in production)
const applications: any[] = [];

export async function POST(request: Request) {
  try {
    const applicationData = await request.json();
    
    // Generate a simple application ID (in a real app, use a proper ID generator)
    const applicationId = `app_${Date.now()}`;
    
    // Create application object
    const application = {
      id: applicationId,
      ...applicationData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    
    applications.push(application);
    
    // In a real app, you would save to a database here
    
    return NextResponse.json({ 
      success: true, 
      applicationId,
      status: 'pending' 
    });
    
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // In a real app, you would fetch applications for the current user
  return NextResponse.json(applications);
}
