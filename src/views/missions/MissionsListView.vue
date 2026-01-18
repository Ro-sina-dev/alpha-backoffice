<template>
  <div class="missions-list-view">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Missions</h1>
        <p class="page-subtitle">Gestion des missions de securite</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card" shadow="never" @click="setStatusFilter(undefined)">
          <div class="stat-value">{{ totalMissions }}</div>
          <div class="stat-label">Total</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card pending" shadow="never" @click="setStatusFilter('pending')">
          <div class="stat-value">{{ statusCounts.pending }}</div>
          <div class="stat-label">En attente</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card accepted" shadow="never" @click="setStatusFilter('accepted')">
          <div class="stat-value">{{ statusCounts.accepted }}</div>
          <div class="stat-label">Acceptees</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card in-progress" shadow="never" @click="setStatusFilter('in_progress')">
          <div class="stat-value">{{ statusCounts.in_progress }}</div>
          <div class="stat-label">En cours</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card completed" shadow="never" @click="setStatusFilter('completed')">
          <div class="stat-value">{{ statusCounts.completed }}</div>
          <div class="stat-label">Terminees</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Filters -->
    <el-card class="filters-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchQuery"
            placeholder="Rechercher par reference..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="statusFilter" placeholder="Statut" clearable @change="handleFilterChange">
            <el-option label="En attente" value="pending" />
            <el-option label="Acceptee" value="accepted" />
            <el-option label="En cours" value="in_progress" />
            <el-option label="Terminee" value="completed" />
            <el-option label="Annulee" value="cancelled" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="Debut"
            end-placeholder="Fin"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            @change="handleFilterChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <!-- Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="missions"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column label="Reference" width="150">
          <template #default="{ row }">
            <span class="reference">{{ row.reference }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Client" min-width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32">
                {{ getInitials(row.client) }}
              </el-avatar>
              <div class="user-info">
                <span class="user-name">{{ row.client?.first_name }} {{ row.client?.last_name }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Agent" min-width="200">
          <template #default="{ row }">
            <div v-if="row.agent" class="user-cell">
              <el-avatar :size="32">
                {{ getAgentInitials(row.agent) }}
              </el-avatar>
              <div class="user-info">
                <span class="user-name">{{ row.agent?.user?.first_name }} {{ row.agent?.user?.last_name }}</span>
              </div>
            </div>
            <span v-else class="empty-text">Non assigne</span>
          </template>
        </el-table-column>

        <el-table-column label="Type" width="150">
          <template #default="{ row }">
            {{ row.type_mission?.name || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Date" width="120">
          <template #default="{ row }">
            {{ formatDate(row.start_date) }}
          </template>
        </el-table-column>

        <el-table-column label="Heure" width="100">
          <template #default="{ row }">
            {{ row.heure_debut }}
          </template>
        </el-table-column>

        <el-table-column label="Duree" width="80">
          <template #default="{ row }">
            {{ row.duration_hours }}h
          </template>
        </el-table-column>

        <el-table-column label="Montant" width="120">
          <template #default="{ row }">
            {{ formatCurrency(row.total_amount) }}
          </template>
        </el-table-column>

        <el-table-column label="Statut" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="180" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" :icon="View" @click="viewMission(row)" />
              <el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, row)">
                <el-button size="small" :icon="MoreFilled" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="row.status === 'pending'" command="assign">
                      Assigner un agent
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'pending' || row.status === 'accepted'" command="cancel">
                      Annuler
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'accepted'" command="start">
                      Demarrer
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'in_progress'" command="complete">
                      Terminer
                    </el-dropdown-item>
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
          :total="totalMissions"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Mission Detail Dialog -->
    <el-dialog v-model="showDetailDialog" title="Details de la mission" width="800px" :fullscreen="isMobile">
      <div v-if="selectedMission" class="mission-detail">
        <el-row :gutter="24">
          <el-col :span="24">
            <div class="mission-header">
              <div class="mission-ref">
                <span class="label">Reference:</span>
                <span class="value">{{ selectedMission.reference }}</span>
              </div>
              <el-tag :type="getStatusTagType(selectedMission.status)" size="large">
                {{ getStatusLabel(selectedMission.status) }}
              </el-tag>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 20px">
          <el-col :span="12">
            <h4>Informations Client</h4>
            <el-descriptions :column="1" border>
              <el-descriptions-item label="Nom">
                {{ selectedMission.client?.first_name }} {{ selectedMission.client?.last_name }}
              </el-descriptions-item>
              <el-descriptions-item label="Email">
                {{ selectedMission.client?.email }}
              </el-descriptions-item>
              <el-descriptions-item label="Telephone">
                {{ selectedMission.client?.phone || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <h4>Informations Agent</h4>
            <el-descriptions v-if="selectedMission.agent" :column="1" border>
              <el-descriptions-item label="Nom">
                {{ selectedMission.agent?.user?.first_name }} {{ selectedMission.agent?.user?.last_name }}
              </el-descriptions-item>
              <el-descriptions-item label="Email">
                {{ selectedMission.agent?.user?.email }}
              </el-descriptions-item>
              <el-descriptions-item label="Telephone">
                {{ selectedMission.agent?.user?.phone || '-' }}
              </el-descriptions-item>
            </el-descriptions>
            <p v-else class="empty-text">Aucun agent assigne</p>
          </el-col>
        </el-row>

        <el-row :gutter="24" style="margin-top: 20px">
          <el-col :span="24">
            <h4>Details de la mission</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Titre">
                {{ selectedMission.title }}
              </el-descriptions-item>
              <el-descriptions-item label="Type">
                {{ selectedMission.type_mission?.name }}
              </el-descriptions-item>
              <el-descriptions-item label="Sous-type">
                {{ selectedMission.sous_type_mission?.name || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="Commune">
                {{ selectedMission.commune?.name }}
              </el-descriptions-item>
              <el-descriptions-item label="Adresse" :span="2">
                {{ selectedMission.address }}
              </el-descriptions-item>
              <el-descriptions-item label="Date">
                {{ formatDate(selectedMission.start_date) }}
              </el-descriptions-item>
              <el-descriptions-item label="Heure">
                {{ selectedMission.heure_debut }} - {{ selectedMission.heure_fin || 'N/A' }}
              </el-descriptions-item>
              <el-descriptions-item label="Duree">
                {{ selectedMission.duration_hours }} heures
              </el-descriptions-item>
              <el-descriptions-item label="Tarif horaire">
                {{ formatCurrency(selectedMission.hour_price) }}
              </el-descriptions-item>
              <el-descriptions-item label="Montant total">
                <span class="amount">{{ formatCurrency(selectedMission.total_amount) }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <div v-if="selectedMission.equipements?.length" style="margin-top: 20px">
          <h4>Equipements</h4>
          <div class="tags-list">
            <el-tag v-for="equip in selectedMission.equipements" :key="equip.id">
              {{ equip.name }}
            </el-tag>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">Fermer</el-button>
      </template>
    </el-dialog>

    <!-- Assign Agent Dialog -->
    <el-dialog v-model="showAssignDialog" title="Assigner un agent" width="500px" :fullscreen="isMobile">
      <el-form label-position="top">
        <el-form-item label="Selectionnez un agent">
          <el-select
            v-model="selectedAgentId"
            filterable
            placeholder="Rechercher un agent..."
            style="width: 100%"
          >
            <el-option
              v-for="agent in availableAgents"
              :key="agent.id"
              :label="`${agent.user?.first_name} ${agent.user?.last_name}`"
              :value="agent.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAssignDialog = false">Annuler</el-button>
        <el-button
          type="primary"
          :loading="assigning"
          :disabled="!selectedAgentId"
          @click="confirmAssign"
        >
          Assigner
        </el-button>
      </template>
    </el-dialog>

    <!-- Cancel Dialog -->
    <el-dialog v-model="showCancelDialog" title="Annuler la mission" width="500px" :fullscreen="isMobile">
      <el-form label-position="top">
        <el-form-item label="Raison de l'annulation" required>
          <el-input
            v-model="cancelReason"
            type="textarea"
            :rows="4"
            placeholder="Expliquez la raison de l'annulation..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCancelDialog = false">Retour</el-button>
        <el-button
          type="danger"
          :loading="cancelling"
          :disabled="!cancelReason"
          @click="confirmCancel"
        >
          Confirmer l'annulation
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMissionsStore, useAgentsStore } from '@/stores'
import { useResponsive } from '@/composables'
import { Search, View, MoreFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Mission, User, Agent } from '@/types'

const missionsStore = useMissionsStore()
const agentsStore = useAgentsStore()
const { isMobile } = useResponsive()

const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref<[string, string] | null>(null)
const currentPage = ref(1)
const pageSize = ref(15)
const showDetailDialog = ref(false)
const showAssignDialog = ref(false)
const showCancelDialog = ref(false)
const selectedMission = ref<Mission | null>(null)
const selectedAgentId = ref('')
const cancelReason = ref('')
const assigning = ref(false)
const cancelling = ref(false)

const loading = computed(() => missionsStore.loading)
const missions = computed(() => missionsStore.missions)
const totalMissions = computed(() => missionsStore.totalMissions)
const availableAgents = computed(() => agentsStore.agents.filter((a: Agent) => a.is_available && a.status === 'approved'))

const statusCounts = computed(() => ({
  pending: missionsStore.pendingMissions.length,
  accepted: missions.value.filter((m: Mission) => m.status === 'accepted').length,
  in_progress: missionsStore.inProgressMissions.length,
  completed: missionsStore.completedMissions.length,
}))

function getInitials(user?: User): string {
  if (!user) return '?'
  return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
}

function getAgentInitials(agent?: Agent): string {
  if (!agent?.user) return '?'
  return `${agent.user.first_name?.[0] || ''}${agent.user.last_name?.[0] || ''}`.toUpperCase()
}

function getStatusTagType(status: string): 'success' | 'warning' | 'danger' | 'info' | '' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info' | ''> = {
    pending: 'warning',
    accepted: 'info',
    in_progress: '',
    completed: 'success',
    cancelled: 'danger',
  }
  return types[status] || 'info'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    accepted: 'Acceptee',
    in_progress: 'En cours',
    completed: 'Terminee',
    cancelled: 'Annulee',
  }
  return labels[status] || status
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' F'
}

function handleSearch() {
  currentPage.value = 1
  fetchMissions()
}

function handleFilterChange() {
  currentPage.value = 1
  fetchMissions()
}

function setStatusFilter(status?: string) {
  statusFilter.value = status || ''
  currentPage.value = 1
  fetchMissions()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  fetchMissions()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchMissions()
}

function viewMission(mission: Mission) {
  selectedMission.value = mission
  showDetailDialog.value = true
}

async function confirmAssign() {
  if (!selectedMission.value || !selectedAgentId.value) return

  assigning.value = true
  try {
    await missionsStore.assignAgent(selectedMission.value.id, selectedAgentId.value)
    ElMessage.success('Agent assigne')
    showAssignDialog.value = false
    selectedAgentId.value = ''
  } catch {
    ElMessage.error('Erreur lors de l\'assignation')
  } finally {
    assigning.value = false
  }
}

async function confirmCancel() {
  if (!selectedMission.value || !cancelReason.value) return

  cancelling.value = true
  try {
    await missionsStore.cancelMission(selectedMission.value.id, cancelReason.value)
    ElMessage.success('Mission annulee')
    showCancelDialog.value = false
    cancelReason.value = ''
  } catch {
    ElMessage.error('Erreur lors de l\'annulation')
  } finally {
    cancelling.value = false
  }
}

async function handleCommand(command: string, mission: Mission) {
  selectedMission.value = mission

  switch (command) {
    case 'assign':
      await agentsStore.fetchAgents({ is_available: true, status: 'approved' })
      showAssignDialog.value = true
      break
    case 'cancel':
      cancelReason.value = ''
      showCancelDialog.value = true
      break
    case 'start':
      ElMessageBox.confirm('Voulez-vous demarrer cette mission ?', 'Confirmation', {
        confirmButtonText: 'Demarrer',
        cancelButtonText: 'Annuler',
      }).then(async () => {
        try {
          await missionsStore.updateStatus(mission.id, 'in_progress')
          ElMessage.success('Mission demarree')
        } catch {
          ElMessage.error('Erreur')
        }
      }).catch(() => {})
      break
    case 'complete':
      ElMessageBox.confirm('Voulez-vous terminer cette mission ?', 'Confirmation', {
        confirmButtonText: 'Terminer',
        cancelButtonText: 'Annuler',
      }).then(async () => {
        try {
          await missionsStore.updateStatus(mission.id, 'completed')
          ElMessage.success('Mission terminee')
        } catch {
          ElMessage.error('Erreur')
        }
      }).catch(() => {})
      break
    case 'delete':
      ElMessageBox.confirm('Voulez-vous supprimer cette mission ?', 'Confirmation', {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      }).then(async () => {
        try {
          await missionsStore.deleteMission(mission.id)
          ElMessage.success('Mission supprimee')
        } catch {
          ElMessage.error('Erreur')
        }
      }).catch(() => {})
      break
  }
}

async function fetchMissions() {
  await missionsStore.fetchMissions({
    page: currentPage.value,
    per_page: pageSize.value,
    search: searchQuery.value || undefined,
    status: statusFilter.value as 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | undefined,
    date_from: dateRange.value?.[0],
    date_to: dateRange.value?.[1],
  })
}

onMounted(() => {
  fetchMissions()
})
</script>

<style scoped>
.missions-list-view {
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

.stat-card.accepted {
  border-left: 3px solid #3b82f6;
}

.stat-card.in-progress {
  border-left: 3px solid #8b5cf6;
}

.stat-card.completed {
  border-left: 3px solid #10b981;
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

.reference {
  font-family: monospace;
  font-weight: 600;
  color: #3b82f6;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 13px;
}

.empty-text {
  color: #94a3b8;
  font-size: 13px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.mission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.mission-ref .label {
  font-size: 14px;
  color: #64748b;
}

.mission-ref .value {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-left: 8px;
}

h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.amount {
  font-weight: 700;
  color: #10b981;
  font-size: 16px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
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
}
</style>
