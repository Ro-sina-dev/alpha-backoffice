<template>
  <div class="agents-list-view">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Agents</h1>
        <p class="page-subtitle">Gestion des agents de securite</p>
      </div>
      <div class="page-header-right">
        <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
          Nouvel agent
        </el-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card" shadow="never">
          <div class="stat-value">{{ totalAgents }}</div>
          <div class="stat-label">Total</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card pending" shadow="never" @click="setStatusFilter('pending')">
          <div class="stat-value">{{ pendingCount }}</div>
          <div class="stat-label">En attente</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card approved" shadow="never" @click="setStatusFilter('approved')">
          <div class="stat-value">{{ approvedCount }}</div>
          <div class="stat-label">Approuves</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card available" shadow="never">
          <div class="stat-value">{{ availableCount }}</div>
          <div class="stat-label">Disponibles</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Filters -->
    <el-card class="filters-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchQuery"
            placeholder="Rechercher..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="statusFilter" placeholder="Statut" clearable @change="handleFilterChange">
            <el-option label="En attente" value="pending" />
            <el-option label="Approuve" value="approved" />
            <el-option label="Rejete" value="rejected" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="availabilityFilter" placeholder="Disponibilite" clearable @change="handleFilterChange">
            <el-option label="Disponible" :value="true" />
            <el-option label="Indisponible" :value="false" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="communeFilter" placeholder="Commune" clearable @change="handleFilterChange">
            <el-option
              v-for="commune in communes"
              :key="commune.id"
              :label="commune.name"
              :value="commune.id"
            />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="agents"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column label="Agent" min-width="250">
          <template #default="{ row }">
            <div class="agent-cell">
              <el-avatar :size="40" :src="row.user?.profile_picture_url">
                {{ getInitials(row.user) }}
              </el-avatar>
              <div class="agent-info">
                <span class="agent-name">{{ row.user?.first_name }} {{ row.user?.last_name }}</span>
                <span class="agent-email">{{ row.user?.email }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Commune" prop="commune.name" width="150">
          <template #default="{ row }">
            {{ row.commune?.name || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Tarif/h" width="100">
          <template #default="{ row }">
            {{ formatCurrency(row.hour_price) }}
          </template>
        </el-table-column>

        <el-table-column label="Note" width="100">
          <template #default="{ row }">
            <div class="rating">
              <el-icon color="#f59e0b"><Star /></el-icon>
              <span>{{ row.average_rating?.toFixed(1) || '-' }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Missions" width="100">
          <template #default="{ row }">
            {{ row.completed_missions_count || 0 }}/{{ row.missions_count || 0 }}
          </template>
        </el-table-column>

        <el-table-column label="Statut" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Dispo." width="100">
          <template #default="{ row }">
            <el-switch
              :model-value="row.is_available"
              :disabled="row.status !== 'approved'"
              @change="() => toggleAvailability(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" :icon="View" @click="viewAgent(row)" />
              <el-button size="small" :icon="Edit" @click="editAgent(row)" />
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="success"
                :icon="Check"
                @click="approveAgent(row)"
              />
              <el-button
                v-if="row.status === 'pending'"
                size="small"
                type="danger"
                :icon="Close"
                @click="rejectAgent(row)"
              />
              <el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, row)">
                <el-button size="small" :icon="MoreFilled" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="documents">Documents</el-dropdown-item>
                    <el-dropdown-item command="certifications">Certifications</el-dropdown-item>
                    <el-dropdown-item command="delete" divided>
                      <span style="color: #ef4444">Supprimer</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 25, 50]"
          :total="totalAgents"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Agent Detail Dialog -->
    <el-dialog v-model="showDetailDialog" title="Details de l'agent" width="800px" :fullscreen="isMobile">
      <div v-if="selectedAgent" class="agent-detail">
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="agent-detail-header">
              <el-avatar :size="100" :src="selectedAgent.user?.profile_picture_url">
                {{ getInitials(selectedAgent.user) }}
              </el-avatar>
              <h3>{{ selectedAgent.user?.first_name }} {{ selectedAgent.user?.last_name }}</h3>
              <el-tag :type="getStatusTagType(selectedAgent.status)">
                {{ getStatusLabel(selectedAgent.status) }}
              </el-tag>
              <div class="agent-rating">
                <el-icon color="#f59e0b" :size="20"><Star /></el-icon>
                <span>{{ selectedAgent.average_rating?.toFixed(1) || 'N/A' }}</span>
                <span class="reviews-count">({{ selectedAgent.reviews_count || 0 }} avis)</span>
              </div>
            </div>
          </el-col>
          <el-col :span="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Email">
                {{ selectedAgent.user?.email }}
              </el-descriptions-item>
              <el-descriptions-item label="Telephone">
                {{ selectedAgent.user?.phone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="Commune">
                {{ selectedAgent.commune?.name }}
              </el-descriptions-item>
              <el-descriptions-item label="Tarif horaire">
                {{ formatCurrency(selectedAgent.hour_price) }}
              </el-descriptions-item>
              <el-descriptions-item label="Tarif journalier">
                {{ formatCurrency(selectedAgent.daily_price) }}
              </el-descriptions-item>
              <el-descriptions-item label="Missions">
                {{ selectedAgent.completed_missions_count }}/{{ selectedAgent.missions_count }}
              </el-descriptions-item>
            </el-descriptions>

            <h4 style="margin-top: 20px">Specialisations</h4>
            <div class="tags-list">
              <el-tag
                v-for="spec in selectedAgent.specialisations"
                :key="spec.id"
                type="info"
              >
                {{ spec.name }}
              </el-tag>
              <span v-if="!selectedAgent.specialisations?.length" class="empty-text">
                Aucune specialisation
              </span>
            </div>

            <h4 style="margin-top: 20px">Certifications</h4>
            <div class="tags-list">
              <el-tag
                v-for="cert in selectedAgent.certifications"
                :key="cert.id"
                type="success"
              >
                {{ cert.name }}
              </el-tag>
              <span v-if="!selectedAgent.certifications?.length" class="empty-text">
                Aucune certification
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">Fermer</el-button>
        <el-button
          v-if="selectedAgent?.status === 'pending'"
          type="success"
          @click="approveAgent(selectedAgent!)"
        >
          Approuver
        </el-button>
        <el-button
          v-if="selectedAgent?.status === 'pending'"
          type="danger"
          @click="rejectAgent(selectedAgent!)"
        >
          Rejeter
        </el-button>
      </template>
    </el-dialog>

    <!-- Reject Dialog -->
    <el-dialog v-model="showRejectDialog" title="Rejeter l'agent" width="500px" :fullscreen="isMobile">
      <el-form label-position="top">
        <el-form-item label="Raison du rejet" required>
          <el-input
            v-model="rejectReason"
            type="textarea"
            :rows="4"
            placeholder="Expliquez la raison du rejet..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showRejectDialog = false">Annuler</el-button>
        <el-button
          type="danger"
          :loading="rejecting"
          :disabled="!rejectReason"
          @click="confirmReject"
        >
          Confirmer le rejet
        </el-button>
      </template>
    </el-dialog>

    <!-- Create Agent Dialog -->
    <el-dialog v-model="showCreateDialog" title="Nouvel agent" width="600px" :fullscreen="isMobile">
      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        label-position="top"
      >
        <el-form-item label="Utilisateur" prop="user_id">
          <el-select
            v-model="createForm.user_id"
            filterable
            remote
            :remote-method="searchUsers"
            placeholder="Rechercher un utilisateur..."
            style="width: 100%"
          >
            <el-option
              v-for="user in usersForSelect"
              :key="user.id"
              :label="user.label"
              :value="user.id"
            />
          </el-select>
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Commune" prop="commune_id">
              <el-select v-model="createForm.commune_id" placeholder="Selectionnez" style="width: 100%">
                <el-option
                  v-for="commune in communes"
                  :key="commune.id"
                  :label="commune.name"
                  :value="commune.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Tarif horaire (FCFA)" prop="hour_price">
              <el-input-number
                v-model="createForm.hour_price"
                :min="0"
                :step="500"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Casier judiciaire (obligatoire)" prop="casier_file">
          <el-upload
            ref="uploadRef"
            :auto-upload="false"
            :limit="1"
            accept=".pdf,.jpg,.jpeg,.png"
            @change="handleFileChange"
          >
            <el-button type="primary" :icon="Upload">Telecharger le fichier</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">Annuler</el-button>
        <el-button type="primary" :loading="creating" @click="createAgent">
          Creer l'agent
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentsStore, useReferenceStore } from '@/stores'
import { useResponsive } from '@/composables'
import {
  Plus,
  Search,
  View,
  Edit,
  Check,
  Close,
  MoreFilled,
  Star,
  Upload,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadFile } from 'element-plus'
import type { Agent, AgentUser } from '@/types'

const router = useRouter()
const agentsStore = useAgentsStore()
const referenceStore = useReferenceStore()
const { isMobile } = useResponsive()

const searchQuery = ref('')
const statusFilter = ref('')
const availabilityFilter = ref<boolean | undefined>()
const communeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const showDetailDialog = ref(false)
const showRejectDialog = ref(false)
const showCreateDialog = ref(false)
const selectedAgent = ref<Agent | null>(null)
const rejectReason = ref('')
const rejecting = ref(false)
const creating = ref(false)
const createFormRef = ref<FormInstance>()

const createForm = reactive({
  user_id: '',
  commune_id: '',
  hour_price: 5000,
  casier_file: null as File | null,
})

const createRules: FormRules = {
  user_id: [{ required: true, message: 'L\'utilisateur est requis', trigger: 'change' }],
  commune_id: [{ required: true, message: 'La commune est requise', trigger: 'change' }],
  hour_price: [{ required: true, message: 'Le tarif est requis', trigger: 'blur' }],
}

const loading = computed(() => agentsStore.loading)
const agents = computed(() => agentsStore.agents)
const totalAgents = computed(() => agentsStore.totalAgents)
const usersForSelect = computed(() => agentsStore.usersForSelect)
const communes = computed(() => referenceStore.communes)

const pendingCount = computed(() => agentsStore.pendingAgents.length)
const approvedCount = computed(() => agentsStore.approvedAgents.length)
const availableCount = computed(() => agents.value.filter((a: Agent) => a.is_available).length)

function getInitials(user?: AgentUser): string {
  if (!user) return '?'
  return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
}

function getStatusTagType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
  }
  return types[status] || 'info'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: 'Approuve',
    pending: 'En attente',
    rejected: 'Rejete',
  }
  return labels[status] || status
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' F'
}

function handleSearch() {
  currentPage.value = 1
  fetchAgents()
}

function handleFilterChange() {
  currentPage.value = 1
  fetchAgents()
}

function setStatusFilter(status: 'pending' | 'approved' | 'rejected') {
  statusFilter.value = status
  currentPage.value = 1
  fetchAgents()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  fetchAgents()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchAgents()
}

function viewAgent(agent: Agent) {
  selectedAgent.value = agent
  showDetailDialog.value = true
}

function editAgent(agent: Agent) {
  router.push(`/agents/${agent.id}/edit`)
}

async function toggleAvailability(agent: Agent) {
  try {
    await agentsStore.toggleAvailability(agent.id)
    ElMessage.success('Disponibilite mise a jour')
  } catch {
    ElMessage.error('Erreur lors de la mise a jour')
  }
}

async function approveAgent(agent: Agent) {
  ElMessageBox.confirm(
    'Voulez-vous approuver cet agent ?',
    'Confirmation',
    {
      confirmButtonText: 'Approuver',
      cancelButtonText: 'Annuler',
      type: 'success',
    },
  ).then(async () => {
    try {
      await agentsStore.approveAgent(agent.id)
      ElMessage.success('Agent approuve')
      showDetailDialog.value = false
    } catch {
      ElMessage.error('Erreur lors de l\'approbation')
    }
  }).catch(() => {})
}

function rejectAgent(agent: Agent) {
  selectedAgent.value = agent
  rejectReason.value = ''
  showRejectDialog.value = true
}

async function confirmReject() {
  if (!selectedAgent.value || !rejectReason.value) return

  rejecting.value = true
  try {
    await agentsStore.rejectAgent(selectedAgent.value.id, rejectReason.value)
    ElMessage.success('Agent rejete')
    showRejectDialog.value = false
    showDetailDialog.value = false
  } catch {
    ElMessage.error('Erreur lors du rejet')
  } finally {
    rejecting.value = false
  }
}

async function searchUsers(query: string) {
  if (query.length < 2) return
  await agentsStore.fetchUsersForSelect({ search: query, exclude_agents: true })
}

function handleFileChange(file: UploadFile) {
  createForm.casier_file = file.raw || null
}

async function createAgent() {
  if (!createFormRef.value) return

  await createFormRef.value.validate(async (valid) => {
    if (!valid) return

    if (!createForm.casier_file) {
      ElMessage.error('Le casier judiciaire est obligatoire')
      return
    }

    creating.value = true
    try {
      await agentsStore.createAgent({
        user_id: createForm.user_id,
        commune_id: createForm.commune_id,
        hour_price: createForm.hour_price,
        documents: [
          {
            file: createForm.casier_file,
            document_type: 'CASIER_JUDICIARE',
          },
        ],
      })
      ElMessage.success('Agent cree avec succes')
      showCreateDialog.value = false
      createForm.user_id = ''
      createForm.commune_id = ''
      createForm.hour_price = 5000
      createForm.casier_file = null
    } catch {
      ElMessage.error('Erreur lors de la creation')
    } finally {
      creating.value = false
    }
  })
}

async function handleCommand(command: string, agent: Agent) {
  switch (command) {
    case 'documents':
      router.push(`/agents/${agent.id}/documents`)
      break
    case 'certifications':
      router.push(`/agents/${agent.id}/certifications`)
      break
    case 'delete':
      ElMessageBox.confirm(
        'Voulez-vous vraiment supprimer cet agent ?',
        'Confirmation',
        {
          confirmButtonText: 'Supprimer',
          cancelButtonText: 'Annuler',
          type: 'warning',
        },
      ).then(async () => {
        try {
          await agentsStore.deleteAgent(agent.id)
          ElMessage.success('Agent supprime')
        } catch {
          ElMessage.error('Erreur lors de la suppression')
        }
      }).catch(() => {})
      break
  }
}

async function fetchAgents() {
  await agentsStore.fetchAgents({
    page: currentPage.value,
    per_page: pageSize.value,
    search: searchQuery.value || undefined,
    status: statusFilter.value as 'pending' | 'approved' | 'rejected' | undefined,
    is_available: availabilityFilter.value,
    commune_id: communeFilter.value || undefined,
  })
}

onMounted(async () => {
  await Promise.all([
    fetchAgents(),
    referenceStore.fetchCommunes(),
  ])
})
</script>

<style scoped>
.agents-list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.stats-row {
  margin-bottom: 4px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.pending {
  border-left: 3px solid #f59e0b;
}

.stat-card.approved {
  border-left: 3px solid #10b981;
}

.stat-card.available {
  border-left: 3px solid #3b82f6;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.filters-card,
.table-card {
  background: #ffffff;
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-info {
  display: flex;
  flex-direction: column;
}

.agent-name {
  font-weight: 500;
  color: #1e293b;
}

.agent-email {
  font-size: 13px;
  color: #64748b;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.agent-detail-header {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.agent-detail-header h3 {
  margin: 16px 0 8px 0;
  font-size: 18px;
  color: #1e293b;
}

.agent-rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 12px;
  font-size: 18px;
  font-weight: 600;
}

.reviews-count {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-text {
  color: #94a3b8;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .page-header-right {
    width: 100%;
  }

  .page-header-right .el-button {
    width: 100%;
  }

  .stat-value {
    font-size: 22px;
  }

  .stat-label {
    font-size: 12px;
  }

  .pagination-wrapper {
    justify-content: center;
  }

  .pagination-wrapper :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .pagination-wrapper :deep(.el-pagination__sizes),
  .pagination-wrapper :deep(.el-pagination__jump) {
    display: none;
  }

  .agent-detail-header {
    margin-bottom: 20px;
  }
}
</style>
