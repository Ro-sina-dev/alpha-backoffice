<template>
  <div class="incidents-list-view">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Incidents</h1>
        <p class="page-subtitle">Gestion des signalements d'incidents</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card" shadow="never" @click="setStatusFilter(undefined)">
          <div class="stat-value">{{ totalIncidents }}</div>
          <div class="stat-label">Total</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card open" shadow="never" @click="setStatusFilter('open')">
          <div class="stat-value">{{ openCount }}</div>
          <div class="stat-label">Ouverts</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card confirmed" shadow="never" @click="setStatusFilter('confirmed')">
          <div class="stat-value">{{ confirmedCount }}</div>
          <div class="stat-label">Confirmes</div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6" :md="4">
        <el-card class="stat-card critical" shadow="never" @click="setUrgencyFilter('critical')">
          <div class="stat-value">{{ criticalCount }}</div>
          <div class="stat-label">Critiques</div>
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
            <el-option label="Ouvert" value="open" />
            <el-option label="Confirme" value="confirmed" />
            <el-option label="En cours" value="in_progress" />
            <el-option label="Resolu" value="resolved" />
            <el-option label="Ferme" value="closed" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="urgencyFilter" placeholder="Urgence" clearable @change="handleFilterChange">
            <el-option label="Faible" value="low" />
            <el-option label="Moyen" value="medium" />
            <el-option label="Eleve" value="high" />
            <el-option label="Critique" value="critical" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="typeFilter" placeholder="Type" clearable @change="handleFilterChange">
            <el-option
              v-for="type in typesIncidents"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="incidents"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column label="Titre" min-width="250">
          <template #default="{ row }">
            <div class="incident-title">
              <span>{{ row.title }}</span>
              <el-tag v-if="row.is_anonymous" type="info" size="small">Anonyme</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Type" width="150">
          <template #default="{ row }">
            <el-tag>{{ row.type_incident?.name || '-' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Communaute" width="150">
          <template #default="{ row }">
            {{ row.community?.name || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Urgence" width="100">
          <template #default="{ row }">
            <el-tag :type="getUrgencyTagType(row.urgency_level)">
              {{ getUrgencyLabel(row.urgency_level) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Statut" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusTagType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Confirmations" width="120">
          <template #default="{ row }">
            <div class="confirmations">
              <el-icon><CircleCheckFilled /></el-icon>
              <span>{{ row.confirmations_count }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Date" width="120">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" :icon="View" @click="viewIncident(row)" />
              <el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, row)">
                <el-button size="small" :icon="MoreFilled" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="row.status === 'open'" command="confirm">
                      Marquer confirme
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'confirmed'" command="in_progress">
                      En cours de traitement
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status === 'in_progress'" command="resolved">
                      Marquer resolu
                    </el-dropdown-item>
                    <el-dropdown-item v-if="row.status !== 'closed'" command="closed">
                      Fermer
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
          :total="totalIncidents"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Incident Detail Dialog -->
    <el-dialog v-model="showDetailDialog" title="Details de l'incident" width="900px" :fullscreen="isMobile">
      <div v-if="selectedIncident" class="incident-detail">
        <el-row :gutter="24">
          <el-col :span="16">
            <div class="incident-header">
              <h2>{{ selectedIncident.title }}</h2>
              <div class="incident-meta">
                <el-tag :type="getStatusTagType(selectedIncident.status)">
                  {{ getStatusLabel(selectedIncident.status) }}
                </el-tag>
                <el-tag :type="getUrgencyTagType(selectedIncident.urgency_level)">
                  {{ getUrgencyLabel(selectedIncident.urgency_level) }}
                </el-tag>
                <el-tag>{{ selectedIncident.type_incident?.name }}</el-tag>
              </div>
            </div>

            <div class="incident-description">
              <h4>Description</h4>
              <p>{{ selectedIncident.description }}</p>
            </div>

            <div v-if="selectedIncident.photos?.length" class="incident-photos">
              <h4>Photos</h4>
              <div class="photos-grid">
                <el-image
                  v-for="photo in selectedIncident.photos"
                  :key="photo.id"
                  :src="photo.url"
                  :preview-src-list="selectedIncident.photos.map(p => p.url)"
                  fit="cover"
                  class="photo-item"
                />
              </div>
            </div>

            <div class="incident-timeline">
              <h4>Activite</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="activity in activities"
                  :key="activity.id"
                  :timestamp="formatDateTime(activity.created_at)"
                  placement="top"
                >
                  <div class="activity-content">
                    <strong>{{ getActivityLabel(activity.type) }}</strong>
                    <span v-if="activity.user"> par {{ activity.user.first_name }} {{ activity.user.last_name }}</span>
                    <p v-if="activity.content">{{ activity.content }}</p>
                  </div>
                </el-timeline-item>
              </el-timeline>
              <el-empty v-if="!activities.length" description="Aucune activite" />
            </div>
          </el-col>

          <el-col :span="8">
            <el-card class="info-card">
              <h4>Informations</h4>
              <el-descriptions :column="1" border>
                <el-descriptions-item label="Communaute">
                  {{ selectedIncident.community?.name }}
                </el-descriptions-item>
                <el-descriptions-item label="Signale par">
                  <span v-if="selectedIncident.is_anonymous">Anonyme</span>
                  <span v-else-if="selectedIncident.reported_by">
                    {{ selectedIncident.reported_by.first_name }} {{ selectedIncident.reported_by.last_name }}
                  </span>
                  <span v-else>-</span>
                </el-descriptions-item>
                <el-descriptions-item label="Date">
                  {{ formatDateTime(selectedIncident.created_at) }}
                </el-descriptions-item>
                <el-descriptions-item label="Adresse">
                  {{ selectedIncident.address || 'Non specifie' }}
                </el-descriptions-item>
                <el-descriptions-item label="Confirmations">
                  {{ selectedIncident.confirmations_count }}
                </el-descriptions-item>
                <el-descriptions-item label="Commentaires">
                  {{ selectedIncident.comments_count }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <el-card class="actions-card" style="margin-top: 16px">
              <h4>Changer le statut</h4>
              <el-select
                v-model="newStatus"
                style="width: 100%; margin-bottom: 12px"
              >
                <el-option label="Ouvert" value="open" />
                <el-option label="Confirme" value="confirmed" />
                <el-option label="En cours" value="in_progress" />
                <el-option label="Resolu" value="resolved" />
                <el-option label="Ferme" value="closed" />
              </el-select>
              <el-button
                type="primary"
                :loading="updatingStatus"
                :disabled="newStatus === selectedIncident.status"
                style="width: 100%"
                @click="changeStatus"
              >
                Mettre a jour
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">Fermer</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useIncidentsStore, useReferenceStore } from '@/stores'
import { useResponsive } from '@/composables'
import { Search, View, MoreFilled, CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Incident, IncidentStatus } from '@/types'

const incidentsStore = useIncidentsStore()
const referenceStore = useReferenceStore()
const { isMobile } = useResponsive()

const searchQuery = ref('')
const statusFilter = ref('')
const urgencyFilter = ref('')
const typeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const showDetailDialog = ref(false)
const selectedIncident = ref<Incident | null>(null)
const newStatus = ref('')
const updatingStatus = ref(false)

const loading = computed(() => incidentsStore.loading)
const incidents = computed(() => incidentsStore.incidents)
const totalIncidents = computed(() => incidentsStore.totalIncidents)
const activities = computed(() => incidentsStore.activities)
const typesIncidents = computed(() => referenceStore.typesIncidents)

const openCount = computed(() => incidentsStore.openIncidents.length)
const confirmedCount = computed(() => incidents.value.filter((i: Incident) => i.status === 'confirmed').length)
const criticalCount = computed(() => incidentsStore.criticalIncidents.length)

function getStatusTagType(status: string): 'success' | 'warning' | 'danger' | 'info' | '' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info' | ''> = {
    open: 'warning',
    confirmed: 'info',
    in_progress: '',
    resolved: 'success',
    closed: 'info',
  }
  return types[status] || 'info'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: 'Ouvert',
    confirmed: 'Confirme',
    in_progress: 'En cours',
    resolved: 'Resolu',
    closed: 'Ferme',
  }
  return labels[status] || status
}

function getUrgencyTagType(urgency: string): 'success' | 'warning' | 'danger' | 'info' {
  const types: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    low: 'success',
    medium: 'info',
    high: 'warning',
    critical: 'danger',
  }
  return types[urgency] || 'info'
}

function getUrgencyLabel(urgency: string): string {
  const labels: Record<string, string> = {
    low: 'Faible',
    medium: 'Moyen',
    high: 'Eleve',
    critical: 'Critique',
  }
  return labels[urgency] || urgency
}

function getActivityLabel(type: string): string {
  const labels: Record<string, string> = {
    report: 'Signalement',
    confirmation: 'Confirmation',
    comment: 'Commentaire',
    status_change: 'Changement de statut',
  }
  return labels[type] || type
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handleSearch() {
  currentPage.value = 1
  fetchIncidents()
}

function handleFilterChange() {
  currentPage.value = 1
  fetchIncidents()
}

function setStatusFilter(status?: IncidentStatus) {
  statusFilter.value = status || ''
  urgencyFilter.value = ''
  currentPage.value = 1
  fetchIncidents()
}

function setUrgencyFilter(urgency: string) {
  urgencyFilter.value = urgency
  statusFilter.value = ''
  currentPage.value = 1
  fetchIncidents()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  fetchIncidents()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchIncidents()
}

async function viewIncident(incident: Incident) {
  selectedIncident.value = incident
  newStatus.value = incident.status
  showDetailDialog.value = true
  await incidentsStore.fetchActivities(incident.id)
}

async function changeStatus() {
  if (!selectedIncident.value || newStatus.value === selectedIncident.value.status) return

  updatingStatus.value = true
  try {
    await incidentsStore.updateStatus(selectedIncident.value.id, newStatus.value as IncidentStatus)
    ElMessage.success('Statut mis a jour')
    selectedIncident.value.status = newStatus.value as IncidentStatus
    await incidentsStore.fetchActivities(selectedIncident.value.id)
  } catch {
    ElMessage.error('Erreur lors de la mise a jour')
  } finally {
    updatingStatus.value = false
  }
}

async function handleCommand(command: string, incident: Incident) {
  if (command === 'delete') {
    ElMessageBox.confirm(
      'Voulez-vous vraiment supprimer cet incident ?',
      'Confirmation',
      {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      },
    ).then(async () => {
      try {
        await incidentsStore.deleteIncident(incident.id)
        ElMessage.success('Incident supprime')
      } catch {
        ElMessage.error('Erreur lors de la suppression')
      }
    }).catch(() => {})
  } else {
    try {
      await incidentsStore.updateStatus(incident.id, command as IncidentStatus)
      ElMessage.success('Statut mis a jour')
    } catch {
      ElMessage.error('Erreur')
    }
  }
}

async function fetchIncidents() {
  await incidentsStore.fetchIncidents({
    page: currentPage.value,
    per_page: pageSize.value,
    search: searchQuery.value || undefined,
    status: statusFilter.value as IncidentStatus | undefined,
    urgency_level: urgencyFilter.value as 'low' | 'medium' | 'high' | 'critical' | undefined,
    type_incident_id: typeFilter.value || undefined,
  })
}

onMounted(async () => {
  await Promise.all([fetchIncidents(), referenceStore.fetchTypesIncidents()])
})
</script>

<style scoped>
.incidents-list-view {
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

.stat-card.open {
  border-left: 3px solid #f59e0b;
}

.stat-card.confirmed {
  border-left: 3px solid #3b82f6;
}

.stat-card.critical {
  border-left: 3px solid #ef4444;
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

.incident-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirmations {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #10b981;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.incident-detail {
  min-height: 400px;
}

.incident-header {
  margin-bottom: 24px;
}

.incident-header h2 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #1e293b;
}

.incident-meta {
  display: flex;
  gap: 8px;
}

.incident-description {
  margin-bottom: 24px;
}

.incident-description h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.incident-description p {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.incident-photos {
  margin-bottom: 24px;
}

.incident-photos h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.photo-item {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  cursor: pointer;
}

.incident-timeline h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.activity-content strong {
  color: #1e293b;
}

.activity-content span {
  color: #64748b;
}

.activity-content p {
  margin: 4px 0 0 0;
  color: #64748b;
  font-size: 14px;
}

.info-card h4,
.actions-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

/* Responsive */
@media (max-width: 768px) {
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
