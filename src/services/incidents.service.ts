/**
 * Incidents Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type {
  ApiResponse,
  PaginatedResponse,
  Incident,
  IncidentFilters,
  IncidentActivity,
  IncidentStatus,
} from '@/types'

export const incidentsService = {
  async getIncidents(filters?: IncidentFilters): Promise<PaginatedResponse<Incident>> {
    const response = await apiClient.get<PaginatedResponse<Incident>>(ApiEndpoints.incidents.list, {
      params: filters,
    })
    return response.data
  },

  async getIncidentById(id: string): Promise<Incident> {
    const response = await apiClient.get<ApiResponse<Incident>>(ApiEndpoints.incidents.getById(id))
    return response.data.data
  },

  async getIncidentsByCommunity(
    communityId: string,
    filters?: IncidentFilters,
  ): Promise<PaginatedResponse<Incident>> {
    const response = await apiClient.get<PaginatedResponse<Incident>>(
      ApiEndpoints.incidents.byCommunity(communityId),
      { params: filters },
    )
    return response.data
  },

  async updateIncidentStatus(id: string, status: IncidentStatus): Promise<Incident> {
    const response = await apiClient.patch<ApiResponse<Incident>>(
      ApiEndpoints.incidents.updateStatus(id),
      { status },
    )
    return response.data.data
  },

  async getIncidentActivities(id: string): Promise<IncidentActivity[]> {
    const response = await apiClient.get<ApiResponse<IncidentActivity[]>>(
      ApiEndpoints.incidents.getActivities(id),
    )
    return response.data.data
  },

  async deleteIncident(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.incidents.delete(id))
  },

  getPhotoUrl(incidentId: string, photoId: string): string {
    return `${apiClient.defaults.baseURL}${ApiEndpoints.incidents.getPhoto(incidentId, photoId)}`
  },
}
