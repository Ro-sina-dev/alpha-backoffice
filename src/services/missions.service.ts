/**
 * Missions Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type {
  ApiResponse,
  PaginatedResponse,
  Mission,
  MissionFilters,
  CreateMissionRequest,
} from '@/types'

export const missionsService = {
  async getMissions(filters?: MissionFilters): Promise<PaginatedResponse<Mission>> {
    const response = await apiClient.get<PaginatedResponse<Mission>>(ApiEndpoints.missions.list, {
      params: filters,
    })
    return response.data
  },

  async getMissionById(id: string): Promise<Mission> {
    const response = await apiClient.get<ApiResponse<Mission>>(ApiEndpoints.missions.getById(id))
    return response.data.data
  },

  async createMission(data: CreateMissionRequest): Promise<Mission> {
    const response = await apiClient.post<ApiResponse<Mission>>(ApiEndpoints.missions.create, data)
    return response.data.data
  },

  async updateMission(id: string, data: Partial<CreateMissionRequest>): Promise<Mission> {
    const response = await apiClient.put<ApiResponse<Mission>>(
      ApiEndpoints.missions.update(id),
      data,
    )
    return response.data.data
  },

  async deleteMission(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.missions.delete(id))
  },

  async cancelMission(id: string, reason: string): Promise<Mission> {
    const response = await apiClient.patch<ApiResponse<Mission>>(ApiEndpoints.missions.cancel(id), {
      cancellation_reason: reason,
    })
    return response.data.data
  },

  async acceptMission(id: string): Promise<Mission> {
    const response = await apiClient.patch<ApiResponse<Mission>>(ApiEndpoints.missions.accept(id))
    return response.data.data
  },

  async startMission(id: string): Promise<Mission> {
    const response = await apiClient.patch<ApiResponse<Mission>>(ApiEndpoints.missions.start(id))
    return response.data.data
  },

  async completeMission(id: string): Promise<Mission> {
    const response = await apiClient.patch<ApiResponse<Mission>>(ApiEndpoints.missions.complete(id))
    return response.data.data
  },

  async assignAgent(id: string, agentId: string): Promise<Mission> {
    const response = await apiClient.patch<ApiResponse<Mission>>(ApiEndpoints.missions.assign(id), {
      agent_id: agentId,
    })
    return response.data.data
  },

  async updateStatus(id: string, status: string): Promise<Mission> {
    const response = await apiClient.patch<ApiResponse<Mission>>(
      ApiEndpoints.missions.updateStatus(id),
      { status },
    )
    return response.data.data
  },

  // Client endpoints
  async getMyMissions(filters?: MissionFilters): Promise<PaginatedResponse<Mission>> {
    const response = await apiClient.get<PaginatedResponse<Mission>>(
      ApiEndpoints.missions.myMissions,
      { params: filters },
    )
    return response.data
  },

  async getMyMissionsHistory(filters?: MissionFilters): Promise<PaginatedResponse<Mission>> {
    const response = await apiClient.get<PaginatedResponse<Mission>>(
      ApiEndpoints.missions.myHistory,
      { params: filters },
    )
    return response.data
  },

  // Agent endpoints
  async getAgentMissions(filters?: MissionFilters): Promise<PaginatedResponse<Mission>> {
    const response = await apiClient.get<PaginatedResponse<Mission>>(
      ApiEndpoints.missions.agentMissions,
      { params: filters },
    )
    return response.data
  },
}
