/**
 * Incidents Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { incidentsService } from '@/services'
import type { Incident, Pagination, IncidentFilters, IncidentActivity, IncidentStatus } from '@/types'

export const useIncidentsStore = defineStore('incidents', () => {
  // State
  const incidents = ref<Incident[]>([])
  const currentIncident = ref<Incident | null>(null)
  const activities = ref<IncidentActivity[]>([])
  const pagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<IncidentFilters>({
    page: 1,
    per_page: 15,
  })

  // Getters
  const totalIncidents = computed(() => pagination.value?.total_rows || 0)
  const openIncidents = computed(() => incidents.value.filter((i) => i.status === 'open'))
  const criticalIncidents = computed(() => incidents.value.filter((i) => i.urgency_level === 'critical'))
  const hasMore = computed(() => {
    if (!pagination.value) return false
    return pagination.value.current_page < pagination.value.last_page
  })

  // Actions
  async function fetchIncidents(newFilters?: IncidentFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }

    loading.value = true
    error.value = null
    try {
      const response = await incidentsService.getIncidents(filters.value)
      incidents.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      pagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des incidents'
      incidents.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchIncidentById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentIncident.value = await incidentsService.getIncidentById(id)
      return currentIncident.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement de l\'incident'
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchIncidentsByCommunity(communityId: string, newFilters?: IncidentFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }

    loading.value = true
    error.value = null
    try {
      const response = await incidentsService.getIncidentsByCommunity(communityId, filters.value)
      incidents.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      pagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des incidents'
      incidents.value = []
    } finally {
      loading.value = false
    }
  }

  async function updateStatus(id: string, status: IncidentStatus) {
    loading.value = true
    error.value = null
    try {
      const updated = await incidentsService.updateIncidentStatus(id, status)
      const index = incidents.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        incidents.value[index] = updated
      }
      if (currentIncident.value?.id === id) {
        currentIncident.value = updated
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

  async function fetchActivities(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await incidentsService.getIncidentActivities(id)
      activities.value = Array.isArray(response) ? response.filter(Boolean) : []
      return activities.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des activités'
      activities.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  async function deleteIncident(id: string) {
    loading.value = true
    error.value = null
    try {
      await incidentsService.deleteIncident(id)
      incidents.value = incidents.value.filter((i) => i.id !== id)
      if (currentIncident.value?.id === id) {
        currentIncident.value = null
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    filters.value.page = page
    fetchIncidents()
  }

  function setSearch(search: string) {
    filters.value.search = search
    filters.value.page = 1
    fetchIncidents()
  }

  function setStatusFilter(status?: IncidentStatus) {
    filters.value.status = status
    filters.value.page = 1
    fetchIncidents()
  }

  function setUrgencyFilter(urgency?: 'low' | 'medium' | 'high' | 'critical') {
    filters.value.urgency_level = urgency
    filters.value.page = 1
    fetchIncidents()
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = { page: 1, per_page: 15 }
  }

  return {
    // State
    incidents,
    currentIncident,
    activities,
    pagination,
    loading,
    error,
    filters,
    // Getters
    totalIncidents,
    openIncidents,
    criticalIncidents,
    hasMore,
    // Actions
    fetchIncidents,
    fetchIncidentById,
    fetchIncidentsByCommunity,
    updateStatus,
    fetchActivities,
    deleteIncident,
    setPage,
    setSearch,
    setStatusFilter,
    setUrgencyFilter,
    clearError,
    resetFilters,
  }
})
