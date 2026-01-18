/**
 * Auth Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userFullName = computed(() =>
    user.value ? `${user.value.first_name} ${user.value.last_name}` : '',
  )
  const userRole = computed(() => user.value?.role?.name || '')
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.first_name?.[0] || ''}${user.value.last_name?.[0] || ''}`.toUpperCase()
  })

  // Actions
  async function login(credentials: LoginCredentials) {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      authService.setTokens(response.access_token)
      user.value = response.user
      return response
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await authService.logout()
    } finally {
      user.value = null
      loading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!authService.isAuthenticated()) return null

    loading.value = true
    error.value = null
    try {
      user.value = await authService.getCurrentUser()
      return user.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la récupération du profil'
      user.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userFullName,
    userRole,
    userInitials,
    // Actions
    login,
    logout,
    fetchCurrentUser,
    clearError,
  }
})
