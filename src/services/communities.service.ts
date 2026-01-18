/**
 * Communities Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type {
  ApiResponse,
  PaginatedResponse,
  Community,
  CommunityMember,
  CommunityRole,
  PaginationParams,
  CommunityFilters,
} from '@/types'

export type { CommunityFilters }

export const communitiesService = {
  async getCommunities(filters?: CommunityFilters): Promise<PaginatedResponse<Community>> {
    const response = await apiClient.get<PaginatedResponse<Community>>(
      ApiEndpoints.communities.list,
      { params: filters },
    )
    return response.data
  },

  async getCommunityById(id: string): Promise<Community> {
    const response = await apiClient.get<ApiResponse<Community>>(
      ApiEndpoints.communities.getById(id),
    )
    return response.data.data
  },

  async createCommunity(data: {
    name: string
    description?: string
    commune_id: string
    is_public?: boolean
  }): Promise<Community> {
    const response = await apiClient.post<ApiResponse<Community>>(
      ApiEndpoints.communities.create,
      data,
    )
    return response.data.data
  },

  async updateCommunity(
    id: string,
    data: Partial<{
      name: string
      description: string
      commune_id: string
      is_public: boolean
      is_active: boolean
    }>,
  ): Promise<Community> {
    const response = await apiClient.put<ApiResponse<Community>>(
      ApiEndpoints.communities.update(id),
      data,
    )
    return response.data.data
  },

  async deleteCommunity(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.communities.delete(id))
  },

  async getCommunityStats(
    id: string,
  ): Promise<{ members_count: number; incidents_count: number; active_incidents: number }> {
    const response = await apiClient.get<
      ApiResponse<{ members_count: number; incidents_count: number; active_incidents: number }>
    >(ApiEndpoints.communities.getStats(id))
    return response.data.data
  },

  async getCommunityMembers(
    id: string,
    filters?: PaginationParams,
  ): Promise<PaginatedResponse<CommunityMember>> {
    const response = await apiClient.get<PaginatedResponse<CommunityMember>>(
      ApiEndpoints.communities.getMembers(id),
      { params: filters },
    )
    return response.data
  },

  async updateMemberRole(communityId: string, memberId: string, role: CommunityRole): Promise<void> {
    await apiClient.patch(ApiEndpoints.communities.updateMemberRole(communityId, memberId), {
      role,
    })
  },

  async removeMember(communityId: string, memberId: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.communities.removeMember(communityId, memberId))
  },

  async approveMember(communityId: string, memberId: string): Promise<void> {
    await apiClient.patch(ApiEndpoints.communities.approveMember(communityId, memberId))
  },

  async rejectMember(communityId: string, memberId: string): Promise<void> {
    await apiClient.patch(ApiEndpoints.communities.rejectMember(communityId, memberId))
  },

  async getCommunitiesByCommune(communeId: string): Promise<Community[]> {
    const response = await apiClient.get<ApiResponse<Community[]>>(
      ApiEndpoints.communities.byCommune(communeId),
    )
    return response.data.data
  },
}
