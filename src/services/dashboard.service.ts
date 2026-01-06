/**
 * Dashboard Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type { ApiResponse, DashboardStats, RecentActivity } from '@/types'

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(ApiEndpoints.dashboard.stats)
    return response.data.data
  },

  async getAgentsStats(): Promise<{
    total: number
    by_status: { pending: number; approved: number; rejected: number }
    by_commune: { commune: string; count: number }[]
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        total: number
        by_status: { pending: number; approved: number; rejected: number }
        by_commune: { commune: string; count: number }[]
      }>
    >(ApiEndpoints.dashboard.agentsStats)
    return response.data.data
  },

  async getMissionsStats(): Promise<{
    total: number
    by_status: Record<string, number>
    by_month: { month: string; count: number; revenue: number }[]
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        total: number
        by_status: Record<string, number>
        by_month: { month: string; count: number; revenue: number }[]
      }>
    >(ApiEndpoints.dashboard.missionsStats)
    return response.data.data
  },

  async getPaymentsStats(): Promise<{
    total_amount: number
    by_status: Record<string, number>
    by_method: Record<string, number>
    by_month: { month: string; amount: number }[]
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        total_amount: number
        by_status: Record<string, number>
        by_method: Record<string, number>
        by_month: { month: string; amount: number }[]
      }>
    >(ApiEndpoints.dashboard.paymentsStats)
    return response.data.data
  },

  async getIncidentsStats(): Promise<{
    total: number
    by_status: Record<string, number>
    by_urgency: Record<string, number>
    by_type: { type: string; count: number }[]
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        total: number
        by_status: Record<string, number>
        by_urgency: Record<string, number>
        by_type: { type: string; count: number }[]
      }>
    >(ApiEndpoints.dashboard.incidentsStats)
    return response.data.data
  },

  async getCommunitiesStats(): Promise<{
    total: number
    total_members: number
    by_commune: { commune: string; count: number }[]
  }> {
    const response = await apiClient.get<
      ApiResponse<{
        total: number
        total_members: number
        by_commune: { commune: string; count: number }[]
      }>
    >(ApiEndpoints.dashboard.communitiesStats)
    return response.data.data
  },

  async getRecentActivity(limit?: number): Promise<RecentActivity[]> {
    const response = await apiClient.get<ApiResponse<RecentActivity[]>>(
      ApiEndpoints.dashboard.recentActivity,
      { params: { limit } },
    )
    return response.data.data
  },
}
