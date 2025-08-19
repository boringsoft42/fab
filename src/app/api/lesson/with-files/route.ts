import { NextRequest, NextResponse } from 'next/server';

// Mock MinIO configuration - in real backend this would be handled by the backend
const mockMinIOUpload = async (file: File, filename: string, folder: string) => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock URL - in real implementation this would be the MinIO URL
  return `http://localhost:9000/${folder}/${filename}`;
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
    
    // Extract files
    const videoFile = formData.get('video') as File;
    const thumbnailFile = formData.get('thumbnail') as File;
    const attachmentFiles = formData.getAll('attachments') as File[];
    
    const timestamp = Date.now();
    let videoUrl = '';
    let thumbnailUrl = '';
    const attachmentUrls: string[] = [];
    
    // Upload video if provided
    if (videoFile) {
      if (!videoFile.type.startsWith('video/')) {
        return NextResponse.json(
          { error: 'Video file must be a video' },
          { status: 400 }
        );
      }
      
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (videoFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Video file size must be less than 500MB' },
          { status: 400 }
        );
      }
      
      const extension = videoFile.name.split('.').pop();
      const filename = `video_${timestamp}.${extension}`;
      videoUrl = await mockMinIOUpload(videoFile, filename, 'videos');
    }
    
    // Upload thumbnail if provided
    if (thumbnailFile) {
      if (!thumbnailFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Thumbnail file must be an image' },
          { status: 400 }
        );
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (thumbnailFile.size > maxSize) {
        return NextResponse.json(
          { error: 'Thumbnail file size must be less than 10MB' },
          { status: 400 }
        );
      }
      
      const extension = thumbnailFile.name.split('.').pop();
      const filename = `thumbnail_${timestamp}.${extension}`;
      thumbnailUrl = await mockMinIOUpload(thumbnailFile, filename, 'thumbnails');
    }
    
    // Upload attachments if provided
    for (const attachmentFile of attachmentFiles) {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (attachmentFile.size > maxSize) {
        return NextResponse.json(
          { error: `Attachment ${attachmentFile.name} size must be less than 50MB` },
          { status: 400 }
        );
      }
      
      const extension = attachmentFile.name.split('.').pop();
      const filename = `attachment_${timestamp}_${attachmentFile.name}`;
      const attachmentUrl = await mockMinIOUpload(attachmentFile, filename, 'attachments');
      attachmentUrls.push(attachmentUrl);
    }
    
    // Create lesson object (in real implementation this would be saved to database)
    const lesson = {
      id: `lesson_${timestamp}`,
      title,
      description,
      content,
      moduleId,
      contentType,
      videoUrl,
      thumbnailUrl,
      duration,
      orderIndex,
      isRequired,
      isPreview,
      attachments: attachmentUrls.map((url, index) => ({
        id: `attachment_${timestamp}_${index}`,
        name: attachmentFiles[index]?.name || `attachment_${index}`,
        url,
        size: attachmentFiles[index]?.size || 0,
        type: attachmentFiles[index]?.type || 'application/octet-stream',
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Add to mock data (in real implementation this would be saved to database)
    const { addMockLesson } = await import('@/lib/mock-data');
    addMockLesson(lesson);
    
    console.log('Lesson created with files:', lesson);
    
    return NextResponse.json(lesson);
    
  } catch (error) {
    console.error('Error creating lesson with files:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson with files' },
      { status: 500 }
    );
  }
}
