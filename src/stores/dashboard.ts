/**
 * Dashboard Store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardService } from '@/services'
import type { DashboardStats, RecentActivity } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const stats = ref<DashboardStats | null>(null)
  const recentActivity = ref<RecentActivity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardService.getStats()
      stats.value = response || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des statistiques'
      stats.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchRecentActivity(limit = 10) {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardService.getRecentActivity(limit)
      recentActivity.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des activités'
      recentActivity.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      await Promise.all([fetchStats(), fetchRecentActivity()])
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement du dashboard'
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    stats,
    recentActivity,
    loading,
    error,
    // Actions
    fetchStats,
    fetchRecentActivity,
    fetchAll,
    clearError,
  }
})
