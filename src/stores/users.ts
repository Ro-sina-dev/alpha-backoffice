/**
 * Users Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usersService } from '@/services'
import type { User, Pagination, UserFilters } from '@/types'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const pagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<UserFilters>({
    page: 1,
    per_page: 15,
  })

  // Getters
  const totalUsers = computed(() => pagination.value?.total_rows || 0)
  const hasMore = computed(() => {
    if (!pagination.value) return false
    return pagination.value.current_page < pagination.value.last_page
  })

  // Actions
  async function fetchUsers(newFilters?: UserFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }

    loading.value = true
    error.value = null
    try {
      const response = await usersService.getUsers(filters.value)
      users.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      pagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
      users.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchUserById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentUser.value = await usersService.getUserById(id)
      return currentUser.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement de l\'utilisateur'
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateUser(id: string, data: Partial<User>) {
    loading.value = true
    error.value = null
    try {
      const updated = await usersService.updateUser(id, data)
      // Update in list if exists
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = updated
      }
      if (currentUser.value?.id === id) {
        currentUser.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: string) {
    loading.value = true
    error.value = null
    try {
      await usersService.deleteUser(id)
      users.value = users.value.filter((u) => u.id !== id)
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleUserStatus(id: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await usersService.toggleUserStatus(id)
      // Update in list
      const index = users.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        users.value[index] = updated
      }
      if (currentUser.value?.id === id) {
        currentUser.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du changement de statut'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    filters.value.page = page
    fetchUsers()
  }

  function setSearch(search: string) {
    filters.value.search = search
    filters.value.page = 1
    fetchUsers()
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = { page: 1, per_page: 15 }
  }

  return {
    // State
    users,
    currentUser,
    pagination,
    loading,
    error,
    filters,
    // Getters
    totalUsers,
    hasMore,
    // Actions
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    toggleUserStatus,
    setPage,
    setSearch,
    clearError,
    resetFilters,
  }
})
