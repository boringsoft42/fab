import { NextRequest, NextResponse } from 'next/server';

// Mock MinIO configuration - in real backend this would be handled by the backend
const mockMinIOUpload = async (file: File, filename: string) => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock URL - in real implementation this would be the MinIO URL
  return `http://localhost:9000/videos/${filename}`;
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const moduleId = formData.get('moduleId') as string;
    const contentType = formData.get('contentType') as string;
    const duration = parseInt(formData.get('duration') as string);
    const orderIndex = parseInt(formData.get('orderIndex') as string);
    const isRequired = formData.get('isRequired') === 'true';
    const isPreview = formData.get('isPreview') === 'false';
    
    // Extract video file
    const videoFile = formData.get('video') as File;
    
    if (!videoFile) {
      return NextResponse.json(
        { error: 'Video file is required' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!videoFile.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'File must be a video' },
        { status: 400 }
      );
    }
    
    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 500MB' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const extension = videoFile.name.split('.').pop();
    const filename = `video_${timestamp}.${extension}`;
    
    // Mock upload to MinIO
    const videoUrl = await mockMinIOUpload(videoFile, filename);
    
    // Create lesson object (in real implementation this would be saved to database)
    const lesson = {
      id: `lesson_${timestamp}`,
      title,
      description,
      content,
      moduleId,
      contentType,
      videoUrl,
      duration,
      orderIndex,
      isRequired,
      isPreview,
      attachments: [],
      resources: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock data (in real implementation this would be saved to database)
    const { addMockLesson } = await import('@/lib/mock-data');
    addMockLesson(lesson);
    
    console.log('Lesson created with video:', lesson);
    
    return NextResponse.json(lesson);
    
  } catch (error) {
    console.error('Error creating lesson with video:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson with video' },
      { status: 500 }
    );
  }
}
