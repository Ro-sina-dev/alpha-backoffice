/**
 * API Endpoints - Alpha Backoffice
 * Base URL: https://api.alphsecurite.ci/api/v1
 *
 * Ce fichier contient tous les endpoints de l'API pour le backoffice.
 * Basé sur la documentation Swagger L5.
 */

export const API_BASE_URL = 'https://api.alphsecurite.ci/api/v1'

export const ApiEndpoints = {
  // ============================================
  // AUTH - Authentification
  // ============================================
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    verifyResetCode: '/auth/verify-reset-code',
    resetPassword: '/auth/reset-password',
    verifyOtp: '/auth/verify-otp',
    resendOtp: '/auth/resend-otp',
  },

  // ============================================
  // USERS - Gestion des utilisateurs
  // ============================================
  users: {
    list: '/users',
    getById: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    toggleStatus: (id: string) => `/users/${id}/toggle-status`,
    changePassword: (id: string) => `/users/${id}/change-password`,
    getProfilePicture: (userId: string) => `/users/${userId}/profile-picture`,
    // Profile endpoints
    completeProfile: '/users/complete-profile',
    me: '/users/me',
  },

  // ============================================
  // IDENTITY VERIFICATION - Vérification d'identité
  // ============================================
  identityVerification: {
    submit: '/identity-verification/submit',
    getStatus: '/identity-verification/status',
    approve: (id: string) => `/identity-verification/${id}/approve`,
    reject: (id: string) => `/identity-verification/${id}/reject`,
    getDocument: (face: string) => `/identity-verification/document/${face}`,
    // Admin endpoints
    adminList: '/admin/identity-verifications',
    adminApprove: (id: string) => `/admin/identity-verifications/${id}/approve`,
    adminReject: (id: string) => `/admin/identity-verifications/${id}/reject`,
  },

  // ============================================
  // AGENTS - Gestion des agents
  // ============================================
  agents: {
    list: '/agents',
    create: '/agents',
    getById: (id: string) => `/agents/${id}`,
    update: (id: string) => `/agents/${id}`,
    delete: (id: string) => `/agents/${id}`,
    toggleAvailability: (id: string) => `/agents/${id}/toggle-availability`,
    getUsersForSelect: '/agents/users-for-select',
    // Documents & Certifications
    getDocument: (agentId: string, documentId: string) => `/agents/${agentId}/documents/${documentId}`,
    getCertification: (agentId: string, certificationId: string) => `/agents/${agentId}/certifications/${certificationId}`,
    approveDocument: (agentId: string, documentId: string) => `/agents/${agentId}/documents/${documentId}/approve`,
    rejectDocument: (agentId: string, documentId: string) => `/agents/${agentId}/documents/${documentId}/reject`,
    approveCertification: (agentId: string, certificationId: string) => `/agents/${agentId}/certifications/${certificationId}/approve`,
    rejectCertification: (agentId: string, certificationId: string) => `/agents/${agentId}/certifications/${certificationId}/reject`,
    // Agent approval
    approve: (id: string) => `/agents/${id}/approve`,
    reject: (id: string) => `/agents/${id}/reject`,
  },

  // ============================================
  // MISSIONS - Gestion des missions
  // ============================================
  missions: {
    list: '/missions',
    create: '/missions',
    getById: (id: string) => `/missions/${id}`,
    update: (id: string) => `/missions/${id}`,
    delete: (id: string) => `/missions/${id}`,
    // Client endpoints
    myMissions: '/missions/my',
    myHistory: '/missions/my/history',
    cancel: (id: string) => `/missions/${id}/cancel`,
    // Agent endpoints
    agentMissions: '/missions/agent',
    accept: (id: string) => `/missions/${id}/accept`,
    start: (id: string) => `/missions/${id}/start`,
    complete: (id: string) => `/missions/${id}/complete`,
    // Admin endpoints
    assign: (id: string) => `/missions/${id}/assign`,
    updateStatus: (id: string) => `/missions/${id}/status`,
  },

  // ============================================
  // REVIEWS - Avis et évaluations
  // ============================================
  reviews: {
    list: '/reviews',
    create: '/reviews',
    getById: (id: string) => `/reviews/${id}`,
    update: (id: string) => `/reviews/${id}`,
    delete: (id: string) => `/reviews/${id}`,
    myReviews: '/reviews/my',
    agentReviews: (agentId: string) => `/reviews/agent/${agentId}`,
  },

  // ============================================
  // COMMUNITIES - Communautés de vigilance
  // ============================================
  communities: {
    list: '/communautes',
    create: '/communautes',
    getById: (id: string) => `/communautes/${id}`,
    update: (id: string) => `/communautes/${id}`,
    delete: (id: string) => `/communautes/${id}`,
    join: (id: string) => `/communautes/${id}/join`,
    leave: (id: string) => `/communautes/${id}/leave`,
    getStats: (id: string) => `/communautes/${id}/stats`,
    getMembers: (id: string) => `/communautes/${id}/membres`,
    byCommune: (communeId: string) => `/communautes/commune/${communeId}`,
    // Admin - Member management
    updateMemberRole: (communityId: string, memberId: string) => `/communautes/${communityId}/membres/${memberId}/role`,
    removeMember: (communityId: string, memberId: string) => `/communautes/${communityId}/membres/${memberId}`,
    approveMember: (communityId: string, memberId: string) => `/communautes/${communityId}/membres/${memberId}/approve`,
    rejectMember: (communityId: string, memberId: string) => `/communautes/${communityId}/membres/${memberId}/reject`,
  },

  // ============================================
  // INCIDENTS - Signalements
  // ============================================
  incidents: {
    list: '/incidents',
    create: '/incidents',
    getById: (id: string) => `/incidents/${id}`,
    update: (id: string) => `/incidents/${id}`,
    delete: (id: string) => `/incidents/${id}`,
    byCommunity: (communityId: string) => `/incidents/communaute/${communityId}`,
    updateStatus: (id: string) => `/incidents/${id}/status`,
    confirm: (id: string) => `/incidents/${id}/confirm`,
    comment: (id: string) => `/incidents/${id}/comment`,
    getActivities: (id: string) => `/incidents/${id}/activities`,
    getPhoto: (incidentId: string, photoId: string) => `/incidents/${incidentId}/photo/${photoId}`,
  },

  // ============================================
  // PAYMENTS - Paiements
  // ============================================
  payments: {
    initiate: '/payments/initiate',
    verify: '/payments/verify',
    getMethods: '/payments/methods',
    getTransactions: '/payments/transactions',
    getById: (id: string) => `/payments/${id}`,
    // Admin endpoints
    list: '/payments',
    refund: (id: string) => `/payments/${id}/refund`,
  },

  // ============================================
  // REFERENCE DATA - Données de référence
  // ============================================
  reference: {
    communes: '/reference/communes',
    typesIncidents: '/reference/types-incidents',
    typesMissions: '/reference/type-missions',
    sousTypesMissions: '/reference/sous-type-missions',
    equipements: '/reference/equipements',
    certifications: '/reference/certifications',
    specialisations: '/reference/specialisations',
    documentTypes: '/reference/document-types',
    // CRUD for each reference (Admin)
    // Communes
    createCommune: '/reference/communes',
    updateCommune: (id: string) => `/reference/communes/${id}`,
    deleteCommune: (id: string) => `/reference/communes/${id}`,
    // Types Incidents
    createTypeIncident: '/reference/types-incidents',
    updateTypeIncident: (id: string) => `/reference/types-incidents/${id}`,
    deleteTypeIncident: (id: string) => `/reference/types-incidents/${id}`,
    // Types Missions
    createTypeMission: '/reference/type-missions',
    updateTypeMission: (id: string) => `/reference/type-missions/${id}`,
    deleteTypeMission: (id: string) => `/reference/type-missions/${id}`,
    // Sous-types Missions
    createSousTypeMission: '/reference/sous-type-missions',
    updateSousTypeMission: (id: string) => `/reference/sous-type-missions/${id}`,
    deleteSousTypeMission: (id: string) => `/reference/sous-type-missions/${id}`,
    // Equipements
    createEquipement: '/reference/equipements',
    updateEquipement: (id: string) => `/reference/equipements/${id}`,
    deleteEquipement: (id: string) => `/reference/equipements/${id}`,
    // Certifications
    createCertification: '/reference/certifications',
    updateCertification: (id: string) => `/reference/certifications/${id}`,
    deleteCertification: (id: string) => `/reference/certifications/${id}`,
    // Specialisations
    createSpecialisation: '/reference/specialisations',
    updateSpecialisation: (id: string) => `/reference/specialisations/${id}`,
    deleteSpecialisation: (id: string) => `/reference/specialisations/${id}`,
    // Document Types
    createDocumentType: '/reference/document-types',
    updateDocumentType: (id: string) => `/reference/document-types/${id}`,
    deleteDocumentType: (id: string) => `/reference/document-types/${id}`,
  },

  // ============================================
  // ROLES - Gestion des rôles (Admin)
  // ============================================
  roles: {
    list: '/roles',
    create: '/roles',
    getById: (id: string) => `/roles/${id}`,
    update: (id: string) => `/roles/${id}`,
    delete: (id: string) => `/roles/${id}`,
  },

  // ============================================
  // PERMISSIONS - Gestion des permissions (Admin)
  // ============================================
  permissions: {
    list: '/permissions',
    create: '/permissions',
    getById: (id: string) => `/permissions/${id}`,
    update: (id: string) => `/permissions/${id}`,
    delete: (id: string) => `/permissions/${id}`,
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notifications: {
    list: '/notifications',
    markAsRead: (id: string) => `/notifications/${id}/read`,
    markAllAsRead: '/notifications/read-all',
    updateSettings: '/notifications/settings',
    // Admin - Send notifications
    send: '/notifications/send',
    sendBulk: '/notifications/send-bulk',
  },

  // ============================================
  // DASHBOARD - Statistiques (Admin)
  // ============================================
  dashboard: {
    stats: '/dashboard/stats',
    agentsStats: '/dashboard/agents',
    missionsStats: '/dashboard/missions',
    paymentsStats: '/dashboard/payments',
    incidentsStats: '/dashboard/incidents',
    communitiesStats: '/dashboard/communities',
    recentActivity: '/dashboard/recent-activity',
  },

  // ============================================
  // REPORTS - Rapports (Admin)
  // ============================================
  reports: {
    missions: '/reports/missions',
    agents: '/reports/agents',
    payments: '/reports/payments',
    incidents: '/reports/incidents',
    users: '/reports/users',
    export: (type: string, format: string) => `/reports/${type}/export?format=${format}`,
  },

  // ============================================
  // SETTINGS - Configuration système (Admin)
  // ============================================
  settings: {
    general: '/settings/general',
    updateGeneral: '/settings/general',
    pricing: '/settings/pricing',
    updatePricing: '/settings/pricing',
    notifications: '/settings/notifications',
    updateNotifications: '/settings/notifications',
  },

  // ============================================
  // AUDIT LOGS - Journaux d'audit (Admin)
  // ============================================
  auditLogs: {
    list: '/audit-logs',
    getById: (id: string) => `/audit-logs/${id}`,
    export: '/audit-logs/export',
  },

  // ============================================
  // FILE UPLOAD
  // ============================================
  files: {
    upload: '/files/upload',
    delete: (id: string) => `/files/${id}`,
  },

  // ============================================
  // LOCATIONS
  // ============================================
  locations: {
    search: '/locations/search',
    getZoneInfo: '/locations/zone',
  },

  // ============================================
  // CHAT - Messagerie
  // ============================================
  chat: {
    list: '/chats',
    getById: (id: string) => `/chats/${id}`,
    sendMessage: (id: string) => `/chats/${id}/messages`,
    getMessages: (id: string) => `/chats/${id}/messages`,
  },
}

// Helper pour construire l'URL complète
export const buildUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const queryString = new URLSearchParams(params).toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }
  return url
}

// Types pour les paramètres de pagination
export interface PaginationParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// Types pour les filtres agents
export interface AgentFilters extends PaginationParams {
  is_active?: boolean
  is_available?: boolean
  commune_id?: string
  status?: 'pending' | 'approved' | 'rejected'
}

// Types pour les filtres missions
export interface MissionFilters extends PaginationParams {
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  agent_id?: string
  client_id?: string
  type_mission_id?: string
  date_from?: string
  date_to?: string
}

// Types pour les filtres utilisateurs
export interface UserFilters extends PaginationParams {
  role_id?: string
  is_active?: boolean
  is_verified?: boolean
}

// Types pour les filtres incidents
export interface IncidentFilters extends PaginationParams {
  status?: 'open' | 'confirmed' | 'resolved' | 'closed'
  urgency_level?: 'low' | 'medium' | 'high' | 'critical'
  type_incident_id?: string
  community_id?: string
  date_from?: string
  date_to?: string
}

// Types pour les filtres paiements
export interface PaymentFilters extends PaginationParams {
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  method?: string
  mission_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
}

export default ApiEndpoints
