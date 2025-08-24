import { apiCall, getAuthHeaders } from '@/lib/api';

export interface DashboardStatistics {
    totalCourses: number;
    totalJobs: number;
    totalEntrepreneurships: number;
    totalInstitutions: number;
    userCourses: number;
    userJobApplications: number;
    userEntrepreneurships: number;
}

export interface RecentActivity {
    id: string;
    icon: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'job_application' | 'course_enrollment' | 'course_completion' | 'entrepreneurship_creation' | 'event_registration' | 'quiz_completion' | 'lesson_completion';
}

export interface DashboardData {
    statistics: DashboardStatistics;
    recentActivities: RecentActivity[];
    total: number;
}

export class DashboardService {
    /**
     * Get dashboard data for a specific user
     * Backend endpoint: GET /api/user-activities/{userId}/dashboard
     */
    static async getUserDashboard(userId: string): Promise<DashboardData> {
        try {
            console.log('📊 DashboardService.getUserDashboard - Fetching dashboard data for user:', userId);

            const response = await apiCall(`/user-activities/${userId}/dashboard`, {
                method: 'GET'
            });

            console.log('✅ DashboardService.getUserDashboard - Dashboard data fetched:', response);
            return response;
        } catch (error) {
            console.error('❌ DashboardService.getUserDashboard - Error:', error);
            throw error;
        }
    }

    /**
     * Get current user's dashboard data
     */
    static async getCurrentUserDashboard(): Promise<DashboardData> {
        try {
            console.log('📊 DashboardService.getCurrentUserDashboard - Fetching current user dashboard data');

            // First get current user info
            const userResponse = await apiCall('/auth/me', {
                method: 'GET'
            });

            console.log('📊 DashboardService.getCurrentUserDashboard - User response:', userResponse);

            // The response structure is { user: User }
            const userId = userResponse.user?.id || userResponse.id;

            if (!userId) {
                console.error('📊 DashboardService.getCurrentUserDashboard - No user ID found in response:', userResponse);
                throw new Error('No user ID found');
            }

            console.log('📊 DashboardService.getCurrentUserDashboard - Using user ID:', userId);

            // Use the real backend endpoint
            return await this.getUserDashboard(userId);
        } catch (error) {
            console.error('❌ DashboardService.getCurrentUserDashboard - Error:', error);
            throw error;
        }
    }


}
