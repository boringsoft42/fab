import { useQuery } from '@tanstack/react-query';
import { DashboardService, DashboardData } from '@/services/dashboard.service';

export const useDashboard = () => {
    return useQuery<DashboardData>({
        queryKey: ['dashboard'],
        queryFn: () => DashboardService.getCurrentUserDashboard(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    });
};

export const useUserDashboard = (userId: string) => {
    return useQuery<DashboardData>({
        queryKey: ['dashboard', userId],
        queryFn: () => DashboardService.getUserDashboard(userId),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        enabled: !!userId,
    });
};
