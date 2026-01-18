/**
 * Types & Interfaces - Alpha Backoffice
 */

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: Pagination
}

export interface Pagination {
  total_rows: number
  per_page: number
  current_page: number
  last_page: number
}

// Base pagination params
export interface PaginationParams {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

// User filters
export interface UserFilters extends PaginationParams {
  role_id?: string
  is_active?: boolean
  is_verified?: boolean
}

// Agent filters
export interface AgentFilters extends PaginationParams {
  is_active?: boolean
  is_available?: boolean
  commune_id?: string
  status?: 'pending' | 'approved' | 'rejected'
}

// Mission filters
export interface MissionFilters extends PaginationParams {
  status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  agent_id?: string
  client_id?: string
  type_mission_id?: string
  date_from?: string
  date_to?: string
}

// Incident filters
export interface IncidentFilters extends PaginationParams {
  status?: 'open' | 'confirmed' | 'in_progress' | 'resolved' | 'closed'
  urgency_level?: 'low' | 'medium' | 'high' | 'critical'
  type_incident_id?: string
  community_id?: string
  date_from?: string
  date_to?: string
}

// Payment filters
export interface PaymentFilters extends PaginationParams {
  status?: 'pending' | 'completed' | 'failed' | 'refunded'
  method?: string
  mission_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
}

// Community filters
export interface CommunityFilters extends PaginationParams {
  commune_id?: string
  is_public?: boolean
  is_active?: boolean
}

// ============================================
// Auth Types
// ============================================
export interface LoginCredentials {
  login: string
  password: string
}

export interface AuthResponse {
  user: User
  access_token: string
  token_type: string
  expires_in: string
}

// ============================================
// User Types
// ============================================
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_picture_url?: string
  is_active: boolean
  is_verified: boolean
  email_verified_at?: string
  phone_verified_at?: string
  role: Role
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  name: string
  slug: string
  description?: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  slug: string
  description?: string
}

// ============================================
// Agent Types
// ============================================
export interface Agent {
  id: string
  slug: string
  user: AgentUser
  commune: Commune
  hour_price: number
  daily_price: number
  is_active: boolean
  is_available: boolean
  missions_count: number
  completed_missions_count: number
  reviews_count: number
  average_rating: number
  status: AgentStatus
  rejection_reason?: string
  approved_at?: string
  rejected_at?: string
  certifications: AgentCertification[]
  specialisations: Specialisation[]
  documents: AgentDocument[]
  created_at: string
  updated_at: string
}

export type AgentStatus = 'pending' | 'approved' | 'rejected'

export interface AgentUser {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_picture_url?: string
}

export interface AgentCertification {
  id: string
  name: string
  description?: string
  certification_number?: string
  certification_date?: string
  certification_file_url?: string
  status?: 'pending' | 'approved' | 'rejected'
}

export interface AgentDocument {
  id: string
  document_type: DocumentType
  document_url: string
  is_active: boolean
  status?: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  created_at: string
}

export type DocumentType = 'CASIER_JUDICIARE' | 'CNI' | 'PERMIS' | 'DIPLOME' | 'AUTRE'

export interface CreateAgentRequest {
  user_id?: string
  commune_id: string
  slug?: string
  hour_price?: number
  daily_price?: number
  is_active?: boolean
  is_available?: boolean
  documents: AgentDocumentInput[]
  certifications?: AgentCertificationInput[]
  specialisations?: AgentSpecialisationInput[]
}

export interface AgentDocumentInput {
  file: File
  document_type: DocumentType
  is_active?: boolean
}

export interface AgentCertificationInput {
  certification_id?: string
  certification_number?: string
  certification_date?: string
  certification_file?: File
  is_active?: boolean
}

export interface AgentSpecialisationInput {
  specialisation_id: string
  is_active?: boolean
}

// ============================================
// Mission Types
// ============================================
export interface Mission {
  id: string
  reference: string
  title: string
  description?: string
  client: User
  agent?: Agent
  type_mission: TypeMission
  sous_type_mission?: SousTypeMission
  equipements: Equipement[]
  commune: Commune
  address: string
  latitude?: number
  longitude?: number
  start_date: string
  end_date?: string
  heure_debut: string
  heure_fin?: string
  duration_hours: number
  hour_price: number
  total_amount: number
  status: MissionStatus
  cancelled_at?: string
  cancellation_reason?: string
  started_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export type MissionStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'

export interface CreateMissionRequest {
  agent_id: string
  title: string
  description?: string
  type_mission_id: string
  sous_type_mission_id?: string
  equipement_ids?: string[]
  commune_id: string
  address: string
  latitude?: number
  longitude?: number
  start_date: string
  heure_debut: string
  duration_hours: number
  hour_price: number
}

// ============================================
// Community Types
// ============================================
export interface Community {
  id: string
  name: string
  description?: string
  commune: Commune
  cover_image_url?: string
  is_public: boolean
  is_active: boolean
  members_count: number
  incidents_count: number
  created_by: User
  created_at: string
  updated_at: string
}

export interface CommunityMember {
  id: string
  user: User
  role: CommunityRole
  status: MemberStatus
  joined_at: string
}

export type CommunityRole = 'admin' | 'moderator' | 'member'
export type MemberStatus = 'pending' | 'approved' | 'rejected'

// ============================================
// Incident Types
// ============================================
export interface Incident {
  id: string
  title: string
  description: string
  type_incident: TypeIncident
  community: Community
  reported_by?: User
  is_anonymous: boolean
  urgency_level: UrgencyLevel
  status: IncidentStatus
  latitude: number
  longitude: number
  address?: string
  photos: IncidentPhoto[]
  confirmations_count: number
  comments_count: number
  created_at: string
  updated_at: string
  resolved_at?: string
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'confirmed' | 'in_progress' | 'resolved' | 'closed'

export interface IncidentPhoto {
  id: string
  url: string
  created_at: string
}

export interface IncidentActivity {
  id: string
  type: 'report' | 'confirmation' | 'comment' | 'status_change'
  user?: User
  content?: string
  old_status?: IncidentStatus
  new_status?: IncidentStatus
  created_at: string
}

// ============================================
// Review Types
// ============================================
export interface Review {
  id: string
  mission: Mission
  client: User
  agent: Agent
  rating: number
  comment?: string
  created_at: string
  updated_at: string
}

// ============================================
// Payment Types
// ============================================
export interface Payment {
  id: string
  reference: string
  mission: Mission
  user: User
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transaction_id?: string
  paid_at?: string
  created_at: string
}

export type PaymentMethod = 'mobile_money' | 'card' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

// ============================================
// Reference Data Types
// ============================================
export interface Commune {
  id: string
  name: string
  code: string
  is_active?: boolean
}

export interface TypeMission {
  id: string
  name: string
  description?: string
  is_active: boolean
}

export interface SousTypeMission {
  id: string
  name: string
  description?: string
  type_mission_id: string
  type_mission?: TypeMission
  is_active: boolean
}

export interface Equipement {
  id: string
  name: string
  description?: string
  price?: number
  is_active: boolean
}

export interface Certification {
  id: string
  name: string
  description?: string
  is_active: boolean
}

export interface Specialisation {
  id: string
  name: string
  description?: string
  is_active: boolean
}

export interface TypeIncident {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
}

export interface ReferenceDocumentType {
  id: string
  name: string
  code: DocumentType
  description?: string
  is_required: boolean
  is_active: boolean
}

// ============================================
// Dashboard Types
// ============================================
export interface DashboardStats {
  users: {
    total: number
    active: number
    new_this_month: number
  }
  agents: {
    total: number
    active: number
    available: number
    pending_approval: number
  }
  missions: {
    total: number
    pending: number
    in_progress: number
    completed: number
    cancelled: number
    revenue_total: number
    revenue_this_month: number
  }
  communities: {
    total: number
    active: number
    total_members: number
  }
  incidents: {
    total: number
    open: number
    resolved: number
    critical: number
  }
}

export interface RecentActivity {
  id: string
  type: 'user_registered' | 'agent_approved' | 'mission_created' | 'incident_reported' | 'payment_received'
  description: string
  user?: User
  created_at: string
}

// ============================================
// Notification Types
// ============================================
export interface Notification {
  id: string
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  read_at?: string
  created_at: string
}

// ============================================
// Audit Log Types
// ============================================
export interface AuditLog {
  id: string
  user: User
  action: string
  model_type: string
  model_id: string
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}

// ============================================
// Settings Types
// ============================================
export interface GeneralSettings {
  app_name: string
  app_description?: string
  contact_email: string
  contact_phone?: string
  address?: string
  currency: string
  timezone: string
}

export interface PricingSettings {
  min_hour_price: number
  max_hour_price: number
  commission_percentage: number
  cancellation_fee_percentage: number
}

// ============================================
// Identity Verification Types
// ============================================
export interface IdentityVerification {
  id: string
  user: User
  document_type: 'CNI' | 'PASSPORT' | 'PERMIS'
  document_front_url: string
  document_back_url?: string
  selfie_url?: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: User
}

// ============================================
// Select Option Type (for dropdowns)
// ============================================
export interface SelectOption {
  id: string
  label: string
  [key: string]: unknown
}

export interface UserSelectOption extends SelectOption {
  first_name: string
  last_name: string
  email: string
  phone?: string
  is_active: boolean
}
