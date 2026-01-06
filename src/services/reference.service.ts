/**
 * Reference Data Service
 */
import apiClient from './api'
import { ApiEndpoints } from '@/api/endpoints'
import type {
  ApiResponse,
  Commune,
  TypeMission,
  SousTypeMission,
  Equipement,
  Certification,
  Specialisation,
  TypeIncident,
  ReferenceDocumentType,
} from '@/types'

export const referenceService = {
  // ============================================
  // Communes
  // ============================================
  async getCommunes(): Promise<Commune[]> {
    const response = await apiClient.get<ApiResponse<Commune[]>>(ApiEndpoints.reference.communes)
    return response.data.data
  },

  async createCommune(data: { name: string; code: string }): Promise<Commune> {
    const response = await apiClient.post<ApiResponse<Commune>>(
      ApiEndpoints.reference.createCommune,
      data,
    )
    return response.data.data
  },

  async updateCommune(id: string, data: { name?: string; code?: string }): Promise<Commune> {
    const response = await apiClient.put<ApiResponse<Commune>>(
      ApiEndpoints.reference.updateCommune(id),
      data,
    )
    return response.data.data
  },

  async deleteCommune(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteCommune(id))
  },

  // ============================================
  // Types Missions
  // ============================================
  async getTypesMissions(): Promise<TypeMission[]> {
    const response = await apiClient.get<ApiResponse<TypeMission[]>>(
      ApiEndpoints.reference.typesMissions,
    )
    return response.data.data
  },

  async createTypeMission(data: {
    name: string
    description?: string
    is_active?: boolean
  }): Promise<TypeMission> {
    const response = await apiClient.post<ApiResponse<TypeMission>>(
      ApiEndpoints.reference.createTypeMission,
      data,
    )
    return response.data.data
  },

  async updateTypeMission(
    id: string,
    data: { name?: string; description?: string; is_active?: boolean },
  ): Promise<TypeMission> {
    const response = await apiClient.put<ApiResponse<TypeMission>>(
      ApiEndpoints.reference.updateTypeMission(id),
      data,
    )
    return response.data.data
  },

  async deleteTypeMission(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteTypeMission(id))
  },

  // ============================================
  // Sous-types Missions
  // ============================================
  async getSousTypesMissions(): Promise<SousTypeMission[]> {
    const response = await apiClient.get<ApiResponse<SousTypeMission[]>>(
      ApiEndpoints.reference.sousTypesMissions,
    )
    return response.data.data
  },

  async createSousTypeMission(data: {
    name: string
    description?: string
    type_mission_id: string
    is_active?: boolean
  }): Promise<SousTypeMission> {
    const response = await apiClient.post<ApiResponse<SousTypeMission>>(
      ApiEndpoints.reference.createSousTypeMission,
      data,
    )
    return response.data.data
  },

  async updateSousTypeMission(
    id: string,
    data: { name?: string; description?: string; type_mission_id?: string; is_active?: boolean },
  ): Promise<SousTypeMission> {
    const response = await apiClient.put<ApiResponse<SousTypeMission>>(
      ApiEndpoints.reference.updateSousTypeMission(id),
      data,
    )
    return response.data.data
  },

  async deleteSousTypeMission(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteSousTypeMission(id))
  },

  // ============================================
  // Equipements
  // ============================================
  async getEquipements(): Promise<Equipement[]> {
    const response = await apiClient.get<ApiResponse<Equipement[]>>(
      ApiEndpoints.reference.equipements,
    )
    return response.data.data
  },

  async createEquipement(data: {
    name: string
    description?: string
    price?: number
    is_active?: boolean
  }): Promise<Equipement> {
    const response = await apiClient.post<ApiResponse<Equipement>>(
      ApiEndpoints.reference.createEquipement,
      data,
    )
    return response.data.data
  },

  async updateEquipement(
    id: string,
    data: { name?: string; description?: string; price?: number; is_active?: boolean },
  ): Promise<Equipement> {
    const response = await apiClient.put<ApiResponse<Equipement>>(
      ApiEndpoints.reference.updateEquipement(id),
      data,
    )
    return response.data.data
  },

  async deleteEquipement(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteEquipement(id))
  },

  // ============================================
  // Certifications
  // ============================================
  async getCertifications(): Promise<Certification[]> {
    const response = await apiClient.get<ApiResponse<Certification[]>>(
      ApiEndpoints.reference.certifications,
    )
    return response.data.data
  },

  async createCertification(data: {
    name: string
    description?: string
    is_active?: boolean
  }): Promise<Certification> {
    const response = await apiClient.post<ApiResponse<Certification>>(
      ApiEndpoints.reference.createCertification,
      data,
    )
    return response.data.data
  },

  async updateCertification(
    id: string,
    data: { name?: string; description?: string; is_active?: boolean },
  ): Promise<Certification> {
    const response = await apiClient.put<ApiResponse<Certification>>(
      ApiEndpoints.reference.updateCertification(id),
      data,
    )
    return response.data.data
  },

  async deleteCertification(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteCertification(id))
  },

  // ============================================
  // Specialisations
  // ============================================
  async getSpecialisations(): Promise<Specialisation[]> {
    const response = await apiClient.get<ApiResponse<Specialisation[]>>(
      ApiEndpoints.reference.specialisations,
    )
    return response.data.data
  },

  async createSpecialisation(data: {
    name: string
    description?: string
    is_active?: boolean
  }): Promise<Specialisation> {
    const response = await apiClient.post<ApiResponse<Specialisation>>(
      ApiEndpoints.reference.createSpecialisation,
      data,
    )
    return response.data.data
  },

  async updateSpecialisation(
    id: string,
    data: { name?: string; description?: string; is_active?: boolean },
  ): Promise<Specialisation> {
    const response = await apiClient.put<ApiResponse<Specialisation>>(
      ApiEndpoints.reference.updateSpecialisation(id),
      data,
    )
    return response.data.data
  },

  async deleteSpecialisation(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteSpecialisation(id))
  },

  // ============================================
  // Types Incidents
  // ============================================
  async getTypesIncidents(): Promise<TypeIncident[]> {
    const response = await apiClient.get<ApiResponse<TypeIncident[]>>(
      ApiEndpoints.reference.typesIncidents,
    )
    return response.data.data
  },

  async createTypeIncident(data: {
    name: string
    description?: string
    icon?: string
    color?: string
    is_active?: boolean
  }): Promise<TypeIncident> {
    const response = await apiClient.post<ApiResponse<TypeIncident>>(
      ApiEndpoints.reference.createTypeIncident,
      data,
    )
    return response.data.data
  },

  async updateTypeIncident(
    id: string,
    data: {
      name?: string
      description?: string
      icon?: string
      color?: string
      is_active?: boolean
    },
  ): Promise<TypeIncident> {
    const response = await apiClient.put<ApiResponse<TypeIncident>>(
      ApiEndpoints.reference.updateTypeIncident(id),
      data,
    )
    return response.data.data
  },

  async deleteTypeIncident(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteTypeIncident(id))
  },

  // ============================================
  // Document Types
  // ============================================
  async getDocumentTypes(): Promise<ReferenceDocumentType[]> {
    const response = await apiClient.get<ApiResponse<ReferenceDocumentType[]>>(
      ApiEndpoints.reference.documentTypes,
    )
    return response.data.data
  },

  async createDocumentType(data: {
    name: string
    code: string
    description?: string
    is_required?: boolean
    is_active?: boolean
  }): Promise<ReferenceDocumentType> {
    const response = await apiClient.post<ApiResponse<ReferenceDocumentType>>(
      ApiEndpoints.reference.createDocumentType,
      data,
    )
    return response.data.data
  },

  async updateDocumentType(
    id: string,
    data: {
      name?: string
      code?: string
      description?: string
      is_required?: boolean
      is_active?: boolean
    },
  ): Promise<ReferenceDocumentType> {
    const response = await apiClient.put<ApiResponse<ReferenceDocumentType>>(
      ApiEndpoints.reference.updateDocumentType(id),
      data,
    )
    return response.data.data
  },

  async deleteDocumentType(id: string): Promise<void> {
    await apiClient.delete(ApiEndpoints.reference.deleteDocumentType(id))
  },
}
