/**
 * Communities Store
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { communitiesService } from '@/services/communities.service'
import type { Community, CommunityMember, Pagination, CommunityRole, CommunityFilters } from '@/types'

export const useCommunitiesStore = defineStore('communities', () => {
  // State
  const communities = ref<Community[]>([])
  const currentCommunity = ref<Community | null>(null)
  const members = ref<CommunityMember[]>([])
  const pagination = ref<Pagination | null>(null)
  const membersPagination = ref<Pagination | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<CommunityFilters>({
    page: 1,
    per_page: 15,
  })

  // Getters
  const totalCommunities = computed(() => pagination.value?.total_rows || 0)
  const activeCommunities = computed(() => communities.value.filter((c) => c.is_active))
  const hasMore = computed(() => {
    if (!pagination.value) return false
    return pagination.value.current_page < pagination.value.last_page
  })

  // Actions
  async function fetchCommunities(newFilters?: CommunityFilters) {
    if (newFilters) {
      filters.value = { ...filters.value, ...newFilters }
    }

    loading.value = true
    error.value = null
    try {
      const response = await communitiesService.getCommunities(filters.value)
      communities.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      pagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des communautés'
      communities.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchCommunityById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentCommunity.value = await communitiesService.getCommunityById(id)
      return currentCommunity.value
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement de la communauté'
      return null
    } finally {
      loading.value = false
    }
  }

  async function createCommunity(data: {
    name: string
    description?: string
    commune_id: string
    is_public?: boolean
  }) {
    loading.value = true
    error.value = null
    try {
      const newCommunity = await communitiesService.createCommunity(data)
      communities.value.unshift(newCommunity)
      return newCommunity
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCommunity(
    id: string,
    data: Partial<{
      name: string
      description: string
      commune_id: string
      is_public: boolean
      is_active: boolean
    }>,
  ) {
    loading.value = true
    error.value = null
    try {
      const updated = await communitiesService.updateCommunity(id, data)
      const index = communities.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        communities.value[index] = updated
      }
      if (currentCommunity.value?.id === id) {
        currentCommunity.value = updated
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

  async function deleteCommunity(id: string) {
    loading.value = true
    error.value = null
    try {
      await communitiesService.deleteCommunity(id)
      communities.value = communities.value.filter((c) => c.id !== id)
      if (currentCommunity.value?.id === id) {
        currentCommunity.value = null
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMembers(communityId: string, page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await communitiesService.getCommunityMembers(communityId, {
        page,
        per_page: 15,
      })
      members.value = Array.isArray(response?.data) ? response.data.filter(Boolean) : []
      membersPagination.value = response?.pagination || null
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des membres'
      members.value = []
    } finally {
      loading.value = false
    }
  }

  async function updateMemberRole(communityId: string, memberId: string, role: CommunityRole) {
    loading.value = true
    error.value = null
    try {
      await communitiesService.updateMemberRole(communityId, memberId, role)
      const member = members.value.find((m) => m.id === memberId)
      if (member) {
        member.role = role
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du changement de rôle'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeMember(communityId: string, memberId: string) {
    loading.value = true
    error.value = null
    try {
      await communitiesService.removeMember(communityId, memberId)
      members.value = members.value.filter((m) => m.id !== memberId)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression du membre'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function approveMember(communityId: string, memberId: string) {
    loading.value = true
    error.value = null
    try {
      await communitiesService.approveMember(communityId, memberId)
      const member = members.value.find((m) => m.id === memberId)
      if (member) {
        member.status = 'approved'
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de l\'approbation'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function rejectMember(communityId: string, memberId: string) {
    loading.value = true
    error.value = null
    try {
      await communitiesService.rejectMember(communityId, memberId)
      const member = members.value.find((m) => m.id === memberId)
      if (member) {
        member.status = 'rejected'
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du rejet'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setPage(page: number) {
    filters.value.page = page
    fetchCommunities()
  }

  function setSearch(search: string) {
    filters.value.search = search
    filters.value.page = 1
    fetchCommunities()
  }

  function clearError() {
    error.value = null
  }

  function resetFilters() {
    filters.value = { page: 1, per_page: 15 }
  }

  return {
    // State
    communities,
    currentCommunity,
    members,
    pagination,
    membersPagination,
    loading,
    error,
    filters,
    // Getters
    totalCommunities,
    activeCommunities,
    hasMore,
    // Actions
    fetchCommunities,
    fetchCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    fetchMembers,
    updateMemberRole,
    removeMember,
    approveMember,
    rejectMember,
    setPage,
    setSearch,
    clearError,
    resetFilters,
  }
})
