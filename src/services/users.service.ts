/**
 * Users Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type { ApiResponse, PaginatedResponse, User, UserFilters } from '@/types'

export const usersService = {
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(ApiEndpoints.users.list, {
      params: filters,
    })
    return response.data
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(ApiEndpoints.users.getById(id))
    return response.data.data
  },

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put<ApiResponse<User>>(ApiEndpoints.users.update(id), data)
    return response.data.data
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.users.delete(id))
  },

  async toggleUserStatus(id: string): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(ApiEndpoints.users.toggleStatus(id))
    return response.data.data
  },

  async changePassword(
    id: string,
    data: { current_password: string; password: string; password_confirmation: string },
  ): Promise<void> {
    await apiClient.post(ApiEndpoints.users.changePassword(id), data)
  },

  getProfilePictureUrl(userId: string): string {
    return `${apiClient.defaults.baseURL}${ApiEndpoints.users.getProfilePicture(userId)}`
  },
}
