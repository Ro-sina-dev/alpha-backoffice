/**
 * Agents Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { agentsService } from '@/services'
import type { Agent, Pagination, AgentFilters, CreateAgentRequest, UserSelectOption } from '@/types'

export const useAgentsStore = defineStore('agents', () => {
  // State
  const agents = ref<Agent[]>([])
  const currentAgent = ref<Agent | null>(null)
  const pagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<AgentFilters>({
    page: 1,
    per_page: 15,
  })
  const usersForSelect = ref<UserSelectOption[]>([])

  // Getters
  const totalAgents = computed(() => pagination.value?.total_rows || 0)
  const pendingAgents = computed(() => agents.value.filter((a) => a.status === 'pending'))
  const approvedAgents = computed(() => agents.value.filter((a) => a.status === 'approved'))
  const hasMore = computed(() => {
    if (!pagination.value) return false
    return pagination.value.current_page < pagination.value.last_page
  })

  // Actions
  async function fetchAgents(newFilters?: AgentFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }

    loading.value = true
    error.value = null
    try {
      const response = await agentsService.getAgents(filters.value)
      agents.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      pagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des agents'
      agents.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAgentById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentAgent.value = await agentsService.getAgentById(id)
      return currentAgent.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement de l\'agent'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createAgent(data: CreateAgentRequest) {
    loading.value = true
    error.value = null
    try {
      const newAgent = await agentsService.createAgent(data)
      agents.value.unshift(newAgent)
      return newAgent
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAgent(
    id: string,
    data: Partial<{
      commune_id: string
      slug: string
      hour_price: number
      daily_price: number
      is_active: boolean
      is_available: boolean
    }>,
  ) {
    loading.value = true
    error.value = null
    try {
      const updated = await agentsService.updateAgent(id, data)
      const index = agents.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        agents.value[index] = updated
      }
      if (currentAgent.value?.id === id) {
        currentAgent.value = updated
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

  async function deleteAgent(id: string) {
    loading.value = true
    error.value = null
    try {
      await agentsService.deleteAgent(id)
      agents.value = agents.value.filter((a) => a.id !== id)
      if (currentAgent.value?.id === id) {
        currentAgent.value = null
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveAgent(id: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await agentsService.approveAgent(id)
      const index = agents.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        agents.value[index] = updated
      }
      if (currentAgent.value?.id === id) {
        currentAgent.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de l\'approbation'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectAgent(id: string, reason: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await agentsService.rejectAgent(id, reason)
      const index = agents.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        agents.value[index] = updated
      }
      if (currentAgent.value?.id === id) {
        currentAgent.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du rejet'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function toggleAvailability(id: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await agentsService.toggleAvailability(id)
      const index = agents.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        agents.value[index] = updated
      }
      if (currentAgent.value?.id === id) {
        currentAgent.value = updated
      }
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du changement de disponibilité'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUsersForSelect(params?: {
    search?: string
    is_active?: boolean
    exclude_agents?: boolean
  }) {
    try {
      const response = await agentsService.getUsersForSelect(params)
      usersForSelect.value = Array.isArray(response) ? response.filter(Boolean) : []
      return usersForSelect.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des utilisateurs'
      usersForSelect.value = []
      return []
    }
  }

  async function approveDocument(agentId: string, documentId: string) {
    loading.value = true
    try {
      await agentsService.approveDocument(agentId, documentId)
      // Refresh agent details
      if (currentAgent.value?.id === agentId) {
        await fetchAgentById(agentId)
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de l\'approbation du document'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectDocument(agentId: string, documentId: string, reason: string) {
    loading.value = true
    try {
      await agentsService.rejectDocument(agentId, documentId, reason)
      if (currentAgent.value?.id === agentId) {
        await fetchAgentById(agentId)
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du rejet du document'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    filters.value.page = page
    fetchAgents()
  }

  function setSearch(search: string) {
    filters.value.search = search
    filters.value.page = 1
    fetchAgents()
  }

  function setStatusFilter(status?: 'pending' | 'approved' | 'rejected') {
    filters.value.status = status
    filters.value.page = 1
    fetchAgents()
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = { page: 1, per_page: 15 }
  }

  return {
    // State
    agents,
    currentAgent,
    pagination,
    loading,
    error,
    filters,
    usersForSelect,
    // Getters
    totalAgents,
    pendingAgents,
    approvedAgents,
    hasMore,
    // Actions
    fetchAgents,
    fetchAgentById,
    createAgent,
    updateAgent,
    deleteAgent,
    approveAgent,
    rejectAgent,
    toggleAvailability,
    fetchUsersForSelect,
    approveDocument,
    rejectDocument,
    setPage,
    setSearch,
    setStatusFilter,
    clearError,
    resetFilters,
  }
})
