import { NextResponse } from 'next/server';

// Simple in-memory storage (replace with a database in production)
const users: any[] = [];

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Generate a simple ID (in a real app, use a proper ID generator)
    const userId = Date.now().toString();
    const verificationStatus = 'pending';
    
    // Create user object
    const user = {
      id: userId,
      ...userData,
      status: verificationStatus,
      createdAt: new Date().toISOString(),
    };
    
    users.push(user);
    
    // In a real app, you would save to a database here
    
    return NextResponse.json({ 
      success: true, 
      userId,
      status: verificationStatus 
    });
    
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
