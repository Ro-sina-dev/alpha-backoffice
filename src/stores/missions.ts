/**
 * Missions Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { missionsService } from '@/services'
import type { Mission, Pagination, MissionFilters, CreateMissionRequest } from '@/types'

export const useMissionsStore = defineStore('missions', () => {
  // State
  const missions = ref<Mission[]>([])
  const currentMission = ref<Mission | null>(null)
  const pagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<MissionFilters>({
    page: 1,
    per_page: 15,
  })

  // Getters
  const totalMissions = computed(() => pagination.value?.total_rows || 0)
  const pendingMissions = computed(() => missions.value.filter((m) => m.status === 'pending'))
  const inProgressMissions = computed(() => missions.value.filter((m) => m.status === 'in_progress'))
  const completedMissions = computed(() => missions.value.filter((m) => m.status === 'completed'))
  const hasMore = computed(() => {
    if (!pagination.value) return false
    return pagination.value.current_page < pagination.value.last_page
  })

  // Actions
  async function fetchMissions(newFilters?: MissionFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }

    loading.value = true
    error.value = null
    try {
      const response = await missionsService.getMissions(filters.value)
      missions.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      pagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des missions'
      missions.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchMissionById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentMission.value = await missionsService.getMissionById(id)
      return currentMission.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement de la mission'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createMission(data: CreateMissionRequest) {
    loading.value = true
    error.value = null
    try {
      const newMission = await missionsService.createMission(data)
      missions.value.unshift(newMission)
      return newMission
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMission(id: string, data: Partial<CreateMissionRequest>) {
    loading.value = true
    error.value = null
    try {
      const updated = await missionsService.updateMission(id, data)
      const index = missions.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        missions.value[index] = updated
      }
      if (currentMission.value?.id === id) {
        currentMission.value = updated
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

  async function deleteMission(id: string) {
    loading.value = true
    error.value = null
    try {
      await missionsService.deleteMission(id)
      missions.value = missions.value.filter((m) => m.id !== id)
      if (currentMission.value?.id === id) {
        currentMission.value = null
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelMission(id: string, reason: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await missionsService.cancelMission(id, reason)
      const index = missions.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        missions.value[index] = updated
      }
      if (currentMission.value?.id === id) {
        currentMission.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de l\'annulation'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function assignAgent(id: string, agentId: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await missionsService.assignAgent(id, agentId)
      const index = missions.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        missions.value[index] = updated
      }
      if (currentMission.value?.id === id) {
        currentMission.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de l\'assignation'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await missionsService.updateStatus(id, status)
      const index = missions.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        missions.value[index] = updated
      }
      if (currentMission.value?.id === id) {
        currentMission.value = updated
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
    fetchMissions()
  }

  function setSearch(search: string) {
    filters.value.search = search
    filters.value.page = 1
    fetchMissions()
  }

  function setStatusFilter(status?: string) {
    filters.value.status = status as MissionFilters['status']
    filters.value.page = 1
    fetchMissions()
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = { page: 1, per_page: 15 }
  }

  return {
    // State
    missions,
    currentMission,
    pagination,
    loading,
    error,
    filters,
    // Getters
    totalMissions,
    pendingMissions,
    inProgressMissions,
    completedMissions,
    hasMore,
    // Actions
    fetchMissions,
    fetchMissionById,
    createMission,
    updateMission,
    deleteMission,
    cancelMission,
    assignAgent,
    updateStatus,
    setPage,
    setSearch,
    setStatusFilter,
    clearError,
    resetFilters,
  }
})
