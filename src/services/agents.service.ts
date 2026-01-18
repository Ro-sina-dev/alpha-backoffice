/**
 * Agents Service
 */
import apiClient, { apiClientMultipart } from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type {
  ApiResponse,
  PaginatedResponse,
  Agent,
  AgentFilters,
  CreateAgentRequest,
  UserSelectOption,
} from '@/types'

export const agentsService = {
  async getAgents(filters?: AgentFilters): Promise<PaginatedResponse<Agent>> {
    const response = await apiClient.get<PaginatedResponse<Agent>>(ApiEndpoints.agents.list, {
      params: filters,
    })
    return response.data
  },

  async getAgentById(id: string): Promise<Agent> {
    const response = await apiClient.get<ApiResponse<Agent>>(ApiEndpoints.agents.getById(id))
    return response.data.data
  },

  async createAgent(data: CreateAgentRequest): Promise<Agent> {
    const formData = new FormData()

    if (data.user_id) formData.append('user_id', data.user_id)
    formData.append('commune_id', data.commune_id)
    if (data.slug) formData.append('slug', data.slug)
    if (data.hour_price !== undefined) formData.append('hour_price', String(data.hour_price))
    if (data.daily_price !== undefined) formData.append('daily_price', String(data.daily_price))
    if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0')
    if (data.is_available !== undefined)
      formData.append('is_available', data.is_available ? '1' : '0')

    // Documents
    data.documents.forEach((doc, index) => {
      formData.append(`documents[${index}][file]`, doc.file)
      formData.append(`documents[${index}][document_type]`, doc.document_type)
      if (doc.is_active !== undefined)
        formData.append(`documents[${index}][is_active]`, doc.is_active ? '1' : '0')
    })

    // Certifications
    data.certifications?.forEach((cert, index) => {
      if (cert.certification_id)
        formData.append(`certifications[${index}][certification_id]`, cert.certification_id)
      if (cert.certification_number)
        formData.append(`certifications[${index}][certification_number]`, cert.certification_number)
      if (cert.certification_date)
        formData.append(`certifications[${index}][certification_date]`, cert.certification_date)
      if (cert.certification_file)
        formData.append(`certifications[${index}][certification_file]`, cert.certification_file)
      if (cert.is_active !== undefined)
        formData.append(`certifications[${index}][is_active]`, cert.is_active ? '1' : '0')
    })

    // Specialisations
    data.specialisations?.forEach((spec, index) => {
      formData.append(`specialisations[${index}][specialisation_id]`, spec.specialisation_id)
      if (spec.is_active !== undefined)
        formData.append(`specialisations[${index}][is_active]`, spec.is_active ? '1' : '0')
    })

    const response = await apiClientMultipart.post<ApiResponse<Agent>>(
      ApiEndpoints.agents.create,
      formData,
    )
    return response.data.data
  },

  async updateAgent(
    id: string,
    data: Partial<{
      commune_id: string
      slug: string
      hour_price: number
      daily_price: number
      is_active: boolean
      is_available: boolean
    }>,
  ): Promise<Agent> {
    const response = await apiClient.put<ApiResponse<Agent>>(ApiEndpoints.agents.update(id), data)
    return response.data.data
  },

  async deleteAgent(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.agents.delete(id))
  },

  async toggleAvailability(id: string): Promise<Agent> {
    const response = await apiClient.patch<ApiResponse<Agent>>(
      ApiEndpoints.agents.toggleAvailability(id),
    )
    return response.data.data
  },

  async approveAgent(id: string): Promise<Agent> {
    const response = await apiClient.patch<ApiResponse<Agent>>(ApiEndpoints.agents.approve(id))
    return response.data.data
  },

  async rejectAgent(id: string, reason: string): Promise<Agent> {
    const response = await apiClient.patch<ApiResponse<Agent>>(ApiEndpoints.agents.reject(id), {
      rejection_reason: reason,
    })
    return response.data.data
  },

  async approveDocument(agentId: string, documentId: string): Promise<void> {
    await apiClient.patch(ApiEndpoints.agents.approveDocument(agentId, documentId))
  },

  async rejectDocument(agentId: string, documentId: string, reason: string): Promise<void> {
    await apiClient.patch(ApiEndpoints.agents.rejectDocument(agentId, documentId), {
      rejection_reason: reason,
    })
  },

  async approveCertification(agentId: string, certificationId: string): Promise<void> {
    await apiClient.patch(ApiEndpoints.agents.approveCertification(agentId, certificationId))
  },

  async rejectCertification(
    agentId: string,
    certificationId: string,
    reason: string,
  ): Promise<void> {
    await apiClient.patch(ApiEndpoints.agents.rejectCertification(agentId, certificationId), {
      rejection_reason: reason,
    })
  },

  async getUsersForSelect(params?: {
    search?: string
    is_active?: boolean
    exclude_agents?: boolean
  }): Promise<UserSelectOption[]> {
    const response = await apiClient.get<ApiResponse<UserSelectOption[]>>(
      ApiEndpoints.agents.getUsersForSelect,
      { params },
    )
    return response.data.data
  },

  getDocumentUrl(agentId: string, documentId: string): string {
    return `${apiClient.defaults.baseURL}${ApiEndpoints.agents.getDocument(agentId, documentId)}`
  },

  getCertificationUrl(agentId: string, certificationId: string): string {
    return `${apiClient.defaults.baseURL}${ApiEndpoints.agents.getCertification(agentId, certificationId)}`
  },
}
