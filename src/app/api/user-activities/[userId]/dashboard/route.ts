import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    console.log('📊 API: Fetching dashboard data for user:', params.userId);

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = params.userId;

    // Get user and profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize statistics
    let statistics = {
      totalCourses: 0,
      totalJobs: 0,
      totalEntrepreneurships: 0,
      totalInstitutions: 0,
      userCourses: 0,
      userJobApplications: 0,
      userEntrepreneurships: 0,
    };

    try {
      // Get basic stats from database
      const totalCourses = await prisma.course.count({ where: { isActive: true } });
      const totalJobs = await prisma.jobOffer.count({ where: { isActive: true } });
      const totalInstitutions = await prisma.institution.count({ where: { isActive: true } });

      statistics.totalCourses = totalCourses;
      statistics.totalJobs = totalJobs;
      statistics.totalInstitutions = totalInstitutions;

      // Get entrepreneurships count
      try {
        const totalEntrepreneurships = await prisma.entrepreneurship.count({
          where: { isActive: true }
        });
        statistics.totalEntrepreneurships = totalEntrepreneurships;
      } catch (error) {
        // Entrepreneurship table might not exist or be accessible
        console.log('Entrepreneurship table not accessible, skipping');
        statistics.totalEntrepreneurships = 0;
      }

      // User-specific stats
      if (['YOUTH', 'ADOLESCENTS'].includes(user.role)) {
        try {
          const userCourses = await prisma.courseEnrollment.count({ where: { studentId: userId } });
          const userJobApplications = await prisma.jobApplication.count({ where: { applicantId: userId } });
          
          statistics.userCourses = userCourses;
          statistics.userJobApplications = userJobApplications;

          // Get user entrepreneurships
          try {
            const userEntrepreneurships = await prisma.entrepreneurship.count({
              where: { ownerId: userId }
            });
            statistics.userEntrepreneurships = userEntrepreneurships;
          } catch (error) {
            console.log('Could not get user entrepreneurships, skipping');
            statistics.userEntrepreneurships = 0;
          }
        } catch (error) {
          console.log('Could not get user-specific stats, using defaults');
        }
      }
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Continue with default stats of 0
    }

    // Generate some recent activities (mock data for now)
    const recentActivities = [
      {
        id: '1',
        icon: 'book',
        title: 'Welcome to CEMSE',
        description: 'Your dashboard is ready to use',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        type: 'course_enrollment' as const
      },
      {
        id: '2',
        icon: 'chart',
        title: 'Database Migration Complete',
        description: 'All systems are operational',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        type: 'job_application' as const
      },
    ];

    // Return dashboard data
    const dashboardData = {
      statistics,
      recentActivities,
      total: recentActivities.length,
    };

    console.log('📊 API: Dashboard data prepared successfully for user:', user.username);
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('📊 API: Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}