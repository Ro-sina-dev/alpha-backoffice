/**
 * Auth Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type { ApiResponse, AuthResponse, LoginCredentials, User } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      ApiEndpoints.auth.login,
      credentials,
    )
    return response.data.data
  },

  async logout(): Promise<void> {
    await apiClient.post(ApiEndpoints.auth.logout)
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token')
    const response = await apiClient.post<ApiResponse<{ access_token: string }>>(
      ApiEndpoints.auth.refreshToken,
      { refresh_token: refreshToken },
    )
    return response.data.data.access_token
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post(ApiEndpoints.auth.forgotPassword, { email })
  },

  async resetPassword(data: {
    email: string
    code: string
    password: string
    password_confirmation: string
  }): Promise<void> {
    await apiClient.post(ApiEndpoints.auth.resetPassword, data)
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(ApiEndpoints.users.me)
    return response.data.data
  },

  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('access_token', accessToken)
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    }
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },
}
