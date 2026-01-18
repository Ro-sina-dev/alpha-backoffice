/**
 * Reference Data Store
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { referenceService } from '@/services'
import type {
  Commune,
  TypeMission,
  SousTypeMission,
  Equipement,
  Certification,
  Specialisation,
  TypeIncident,
  ReferenceDocumentType,
} from '@/types'

export const useReferenceStore = defineStore('reference', () => {
  // State
  const communes = ref<Commune[]>([])
  const typesMissions = ref<TypeMission[]>([])
  const sousTypesMissions = ref<SousTypeMission[]>([])
  const equipements = ref<Equipement[]>([])
  const certifications = ref<Certification[]>([])
  const specialisations = ref<Specialisation[]>([])
  const typesIncidents = ref<TypeIncident[]>([])
  const documentTypes = ref<ReferenceDocumentType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions - Communes
  async function fetchCommunes() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getCommunes()
      communes.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des communes'
      communes.value = []
    } finally {
      loading.value = false
    }
  }

  async function createCommune(data: { name: string; code: string }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createCommune(data)
      communes.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCommune(id: string, data: { name?: string; code?: string }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateCommune(id, data)
      const index = communes.value.findIndex((c) => c.id === id)
      if (index !== -1) communes.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCommune(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteCommune(id)
      communes.value = communes.value.filter((c) => c.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Types Missions
  async function fetchTypesMissions() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getTypesMissions()
      typesMissions.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      typesMissions.value = []
    } finally {
      loading.value = false
    }
  }

  async function createTypeMission(data: { name: string; description?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createTypeMission(data)
      typesMissions.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTypeMission(id: string, data: { name?: string; description?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateTypeMission(id, data)
      const index = typesMissions.value.findIndex((t) => t.id === id)
      if (index !== -1) typesMissions.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTypeMission(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteTypeMission(id)
      typesMissions.value = typesMissions.value.filter((t) => t.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Sous-types Missions
  async function fetchSousTypesMissions() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getSousTypesMissions()
      sousTypesMissions.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      sousTypesMissions.value = []
    } finally {
      loading.value = false
    }
  }

  async function createSousTypeMission(data: { name: string; description?: string; type_mission_id: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createSousTypeMission(data)
      sousTypesMissions.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSousTypeMission(id: string, data: { name?: string; description?: string; type_mission_id?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateSousTypeMission(id, data)
      const index = sousTypesMissions.value.findIndex((t) => t.id === id)
      if (index !== -1) sousTypesMissions.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSousTypeMission(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteSousTypeMission(id)
      sousTypesMissions.value = sousTypesMissions.value.filter((t) => t.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Equipements
  async function fetchEquipements() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getEquipements()
      equipements.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      equipements.value = []
    } finally {
      loading.value = false
    }
  }

  async function createEquipement(data: { name: string; description?: string; price?: number; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createEquipement(data)
      equipements.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateEquipement(id: string, data: { name?: string; description?: string; price?: number; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateEquipement(id, data)
      const index = equipements.value.findIndex((e) => e.id === id)
      if (index !== -1) equipements.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteEquipement(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteEquipement(id)
      equipements.value = equipements.value.filter((e) => e.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Certifications
  async function fetchCertifications() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getCertifications()
      certifications.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      certifications.value = []
    } finally {
      loading.value = false
    }
  }

  async function createCertification(data: { name: string; description?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createCertification(data)
      certifications.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCertification(id: string, data: { name?: string; description?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateCertification(id, data)
      const index = certifications.value.findIndex((c) => c.id === id)
      if (index !== -1) certifications.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCertification(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteCertification(id)
      certifications.value = certifications.value.filter((c) => c.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Specialisations
  async function fetchSpecialisations() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getSpecialisations()
      specialisations.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      specialisations.value = []
    } finally {
      loading.value = false
    }
  }

  async function createSpecialisation(data: { name: string; description?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createSpecialisation(data)
      specialisations.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSpecialisation(id: string, data: { name?: string; description?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateSpecialisation(id, data)
      const index = specialisations.value.findIndex((s) => s.id === id)
      if (index !== -1) specialisations.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSpecialisation(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteSpecialisation(id)
      specialisations.value = specialisations.value.filter((s) => s.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Types Incidents
  async function fetchTypesIncidents() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getTypesIncidents()
      typesIncidents.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      typesIncidents.value = []
    } finally {
      loading.value = false
    }
  }

  async function createTypeIncident(data: { name: string; description?: string; icon?: string; color?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const newItem = await referenceService.createTypeIncident(data)
      typesIncidents.value.push(newItem)
      return newItem
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la création'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTypeIncident(id: string, data: { name?: string; description?: string; icon?: string; color?: string; is_active?: boolean }) {
    loading.value = true
    error.value = null
    try {
      const updated = await referenceService.updateTypeIncident(id, data)
      const index = typesIncidents.value.findIndex((t) => t.id === id)
      if (index !== -1) typesIncidents.value[index] = updated
      return updated
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTypeIncident(id: string) {
    loading.value = true
    error.value = null
    try {
      await referenceService.deleteTypeIncident(id)
      typesIncidents.value = typesIncidents.value.filter((t) => t.id !== id)
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors de la suppression'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Document Types
  async function fetchDocumentTypes() {
    loading.value = true
    error.value = null
    try {
      const response = await referenceService.getDocumentTypes()
      documentTypes.value = Array.isArray(response) ? response.filter(Boolean) : []
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement'
      documentTypes.value = []
    } finally {
      loading.value = false
    }
  }

  // Fetch all references at once
  async function fetchAllReferences() {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchCommunes(),
        fetchTypesMissions(),
        fetchSousTypesMissions(),
        fetchEquipements(),
        fetchCertifications(),
        fetchSpecialisations(),
        fetchTypesIncidents(),
        fetchDocumentTypes(),
      ])
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Erreur lors du chargement des références'
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    communes,
    typesMissions,
    sousTypesMissions,
    equipements,
    certifications,
    specialisations,
    typesIncidents,
    documentTypes,
    loading,
    error,
    // Actions - Communes
    fetchCommunes,
    createCommune,
    updateCommune,
    deleteCommune,
    // Actions - Types Missions
    fetchTypesMissions,
    createTypeMission,
    updateTypeMission,
    deleteTypeMission,
    // Actions - Sous-types Missions
    fetchSousTypesMissions,
    createSousTypeMission,
    updateSousTypeMission,
    deleteSousTypeMission,
    // Actions - Equipements
    fetchEquipements,
    createEquipement,
    updateEquipement,
    deleteEquipement,
    // Actions - Certifications
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    // Actions - Specialisations
    fetchSpecialisations,
    createSpecialisation,
    updateSpecialisation,
    deleteSpecialisation,
    // Actions - Types Incidents
    fetchTypesIncidents,
    createTypeIncident,
    updateTypeIncident,
    deleteTypeIncident,
    // Actions - Document Types
    fetchDocumentTypes,
    // Actions - All
    fetchAllReferences,
    clearError,
  }
})
