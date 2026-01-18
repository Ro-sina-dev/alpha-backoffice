<template>
  <div class="communities-list-view">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Communautes</h1>
        <p class="page-subtitle">Gestion des communautes de vigilance</p>
      </div>
      <div class="page-header-right">
        <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
          Nouvelle communaute
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <el-card class="filters-card" shadow="never">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchQuery"
            placeholder="Rechercher..."
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
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
        <el-col :xs="24" :sm="12" :md="4">
          <el-select v-model="publicFilter" placeholder="Visibilite" clearable @change="handleFilterChange">
            <el-option label="Publique" :value="true" />
            <el-option label="Privee" :value="false" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- Communities Grid -->
    <el-row v-loading="loading" :gutter="20">
      <el-col
        v-for="community in communities"
        :key="community.id"
        :xs="24"
        :sm="12"
        :lg="8"
        :xl="6"
      >
        <el-card class="community-card" shadow="hover" @click="viewCommunity(community)">
          <div class="community-header">
            <el-avatar :size="48" :style="{ backgroundColor: getAvatarColor(community.name) }">
              {{ community.name[0] }}
            </el-avatar>
            <div class="community-info">
              <h3 class="community-name">{{ community.name }}</h3>
              <span class="community-commune">{{ community.commune?.name }}</span>
            </div>
            <el-tag :type="community.is_public ? 'success' : 'info'" size="small">
              {{ community.is_public ? 'Publique' : 'Privee' }}
            </el-tag>
          </div>

          <p class="community-description">
            {{ community.description || 'Pas de description' }}
          </p>

          <div class="community-stats">
            <div class="stat">
              <el-icon><User /></el-icon>
              <span>{{ community.members_count }} membres</span>
            </div>
            <div class="stat">
              <el-icon><Warning /></el-icon>
              <span>{{ community.incidents_count }} incidents</span>
            </div>
          </div>

          <div class="community-actions">
            <el-button size="small" :icon="View" @click.stop="viewCommunity(community)">
              Voir
            </el-button>
            <el-button size="small" :icon="Edit" @click.stop="editCommunity(community)">
              Modifier
            </el-button>
            <el-button
              size="small"
              type="danger"
              :icon="Delete"
              @click.stop="deleteCommunity(community)"
            />
          </div>
        </el-card>
      </el-col>

      <el-col v-if="communities.length === 0 && !loading" :span="24">
        <el-empty description="Aucune communaute trouvee" />
      </el-col>
    </el-row>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[12, 24, 48]"
        :total="totalCommunities"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Community Detail Dialog -->
    <el-dialog v-model="showDetailDialog" title="Details de la communaute" width="800px" :fullscreen="isMobile">
      <div v-if="selectedCommunity" class="community-detail">
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="detail-header">
              <el-avatar
                :size="80"
                :style="{ backgroundColor: getAvatarColor(selectedCommunity.name) }"
              >
                {{ selectedCommunity.name[0] }}
              </el-avatar>
              <h3>{{ selectedCommunity.name }}</h3>
              <el-tag :type="selectedCommunity.is_public ? 'success' : 'info'">
                {{ selectedCommunity.is_public ? 'Publique' : 'Privee' }}
              </el-tag>
              <el-tag :type="selectedCommunity.is_active ? 'success' : 'danger'" style="margin-left: 8px">
                {{ selectedCommunity.is_active ? 'Active' : 'Inactive' }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="Commune">
                {{ selectedCommunity.commune?.name }}
              </el-descriptions-item>
              <el-descriptions-item label="Membres">
                {{ selectedCommunity.members_count }}
              </el-descriptions-item>
              <el-descriptions-item label="Incidents">
                {{ selectedCommunity.incidents_count }}
              </el-descriptions-item>
              <el-descriptions-item label="Creee le">
                {{ formatDate(selectedCommunity.created_at) }}
              </el-descriptions-item>
              <el-descriptions-item label="Description" :span="2">
                {{ selectedCommunity.description || 'Pas de description' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>

        <!-- Members Tab -->
        <el-tabs v-model="activeTab" style="margin-top: 20px">
          <el-tab-pane label="Membres" name="members">
            <el-table :data="members" v-loading="loadingMembers">
              <el-table-column label="Membre" min-width="200">
                <template #default="{ row }">
                  <div class="user-cell">
                    <el-avatar :size="32">
                      {{ row.user?.first_name?.[0] }}{{ row.user?.last_name?.[0] }}
                    </el-avatar>
                    <span>{{ row.user?.first_name }} {{ row.user?.last_name }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="Role" width="120">
                <template #default="{ row }">
                  <el-tag :type="getRoleTagType(row.role)">
                    {{ getRoleLabel(row.role) }}
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
              <el-table-column label="Actions" width="200">
                <template #default="{ row }">
                  <el-button-group v-if="row.status === 'approved'">
                    <el-select
                      :model-value="row.role"
                      size="small"
                      style="width: 110px"
                      @change="(role: string) => updateRole(row.id, role)"
                    >
                      <el-option label="Admin" value="admin" />
                      <el-option label="Moderateur" value="moderator" />
                      <el-option label="Membre" value="member" />
                    </el-select>
                    <el-button
                      size="small"
                      type="danger"
                      :icon="Delete"
                      @click="removeMember(row.id)"
                    />
                  </el-button-group>
                  <el-button-group v-else-if="row.status === 'pending'">
                    <el-button size="small" type="success" @click="approveMember(row.id)">
                      Approuver
                    </el-button>
                    <el-button size="small" type="danger" @click="rejectMember(row.id)">
                      Rejeter
                    </el-button>
                  </el-button-group>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">Fermer</el-button>
        <el-button type="primary" @click="editCommunity(selectedCommunity!)">
          Modifier
        </el-button>
      </template>
    </el-dialog>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="showCreateDialog"
      :title="isEditing ? 'Modifier la communaute' : 'Nouvelle communaute'"
      width="500px"
      :fullscreen="isMobile"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item label="Nom" prop="name">
          <el-input v-model="form.name" placeholder="Nom de la communaute" />
        </el-form-item>

        <el-form-item label="Commune" prop="commune_id">
          <el-select v-model="form.commune_id" placeholder="Selectionnez" style="width: 100%">
            <el-option
              v-for="commune in communes"
              :key="commune.id"
              :label="commune.name"
              :value="commune.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Description de la communaute..."
          />
        </el-form-item>

        <el-form-item label="Visibilite">
          <el-switch
            v-model="form.is_public"
            active-text="Publique"
            inactive-text="Privee"
          />
        </el-form-item>

        <el-form-item v-if="isEditing" label="Statut">
          <el-switch
            v-model="form.is_active"
            active-text="Active"
            inactive-text="Inactive"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeForm">Annuler</el-button>
        <el-button type="primary" :loading="saving" @click="submitForm">
          {{ isEditing ? 'Enregistrer' : 'Creer' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useCommunitiesStore, useReferenceStore } from '@/stores'
import { useResponsive } from '@/composables'
import { Plus, Search, View, Edit, Delete, User, Warning } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { Community, CommunityRole } from '@/types'

const communitiesStore = useCommunitiesStore()
const referenceStore = useReferenceStore()
const { isMobile } = useResponsive()

const searchQuery = ref('')
const communeFilter = ref('')
const publicFilter = ref<boolean | undefined>()
const currentPage = ref(1)
const pageSize = ref(12)
const showDetailDialog = ref(false)
const showCreateDialog = ref(false)
const selectedCommunity = ref<Community | null>(null)
const activeTab = ref('members')
const formRef = ref<FormInstance>()
const isEditing = ref(false)
const saving = ref(false)
const loadingMembers = ref(false)

const form = reactive({
  name: '',
  commune_id: '',
  description: '',
  is_public: true,
  is_active: true,
})

const formRules: FormRules = {
  name: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
  commune_id: [{ required: true, message: 'La commune est requise', trigger: 'change' }],
}

const loading = computed(() => communitiesStore.loading)
const communities = computed(() => communitiesStore.communities)
const totalCommunities = computed(() => communitiesStore.totalCommunities)
const members = computed(() => communitiesStore.members)
const communes = computed(() => referenceStore.communes)

const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % colors.length
  return colors[index] || '#3b82f6'
}

function getRoleTagType(role: string): 'danger' | 'warning' | 'info' {
  const types: Record<string, 'danger' | 'warning' | 'info'> = {
    admin: 'danger',
    moderator: 'warning',
    member: 'info',
  }
  return types[role] || 'info'
}

function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    admin: 'Admin',
    moderator: 'Moderateur',
    member: 'Membre',
  }
  return labels[role] || role
}

function getStatusTagType(status: string): 'success' | 'warning' | 'danger' {
  const types: Record<string, 'success' | 'warning' | 'danger'> = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
  }
  return types[status] || 'warning'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: 'Approuve',
    pending: 'En attente',
    rejected: 'Rejete',
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

function handleSearch() {
  currentPage.value = 1
  fetchCommunities()
}

function handleFilterChange() {
  currentPage.value = 1
  fetchCommunities()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  fetchCommunities()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchCommunities()
}

async function viewCommunity(community: Community) {
  selectedCommunity.value = community
  showDetailDialog.value = true
  activeTab.value = 'members'
  loadingMembers.value = true
  await communitiesStore.fetchMembers(community.id)
  loadingMembers.value = false
}

function editCommunity(community: Community) {
  isEditing.value = true
  selectedCommunity.value = community
  form.name = community.name
  form.commune_id = community.commune?.id || ''
  form.description = community.description || ''
  form.is_public = community.is_public
  form.is_active = community.is_active
  showDetailDialog.value = false
  showCreateDialog.value = true
}

async function deleteCommunity(community: Community) {
  ElMessageBox.confirm(
    'Voulez-vous vraiment supprimer cette communaute ?',
    'Confirmation',
    {
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      type: 'warning',
    },
  ).then(async () => {
    try {
      await communitiesStore.deleteCommunity(community.id)
      ElMessage.success('Communaute supprimee')
    } catch {
      ElMessage.error('Erreur lors de la suppression')
    }
  }).catch(() => {})
}

async function updateRole(memberId: string, role: string) {
  if (!selectedCommunity.value) return
  try {
    await communitiesStore.updateMemberRole(selectedCommunity.value.id, memberId, role as CommunityRole)
    ElMessage.success('Role mis a jour')
  } catch {
    ElMessage.error('Erreur')
  }
}

async function removeMember(memberId: string) {
  if (!selectedCommunity.value) return
  ElMessageBox.confirm('Retirer ce membre ?', 'Confirmation').then(async () => {
    try {
      await communitiesStore.removeMember(selectedCommunity.value!.id, memberId)
      ElMessage.success('Membre retire')
    } catch {
      ElMessage.error('Erreur')
    }
  }).catch(() => {})
}

async function approveMember(memberId: string) {
  if (!selectedCommunity.value) return
  try {
    await communitiesStore.approveMember(selectedCommunity.value.id, memberId)
    ElMessage.success('Membre approuve')
  } catch {
    ElMessage.error('Erreur')
  }
}

async function rejectMember(memberId: string) {
  if (!selectedCommunity.value) return
  try {
    await communitiesStore.rejectMember(selectedCommunity.value.id, memberId)
    ElMessage.success('Membre rejete')
  } catch {
    ElMessage.error('Erreur')
  }
}

function closeForm() {
  showCreateDialog.value = false
  isEditing.value = false
  form.name = ''
  form.commune_id = ''
  form.description = ''
  form.is_public = true
  form.is_active = true
}

async function submitForm() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saving.value = true
    try {
      if (isEditing.value && selectedCommunity.value) {
        await communitiesStore.updateCommunity(selectedCommunity.value.id, {
          name: form.name,
          commune_id: form.commune_id,
          description: form.description,
          is_public: form.is_public,
          is_active: form.is_active,
        })
        ElMessage.success('Communaute mise a jour')
      } else {
        await communitiesStore.createCommunity({
          name: form.name,
          commune_id: form.commune_id,
          description: form.description,
          is_public: form.is_public,
        })
        ElMessage.success('Communaute creee')
      }
      closeForm()
    } catch {
      ElMessage.error('Erreur')
    } finally {
      saving.value = false
    }
  })
}

async function fetchCommunities() {
  await communitiesStore.fetchCommunities({
    page: currentPage.value,
    per_page: pageSize.value,
    search: searchQuery.value || undefined,
    commune_id: communeFilter.value || undefined,
    is_public: publicFilter.value,
  })
}

watch(showCreateDialog, (newVal) => {
  if (!newVal) {
    isEditing.value = false
  }
})

onMounted(async () => {
  await Promise.all([fetchCommunities(), referenceStore.fetchCommunes()])
})
</script>

<style scoped>
.communities-list-view {
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

.filters-card {
  background: #ffffff;
}

.community-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.community-card:hover {
  transform: translateY(-4px);
}

.community-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.community-info {
  flex: 1;
  min-width: 0;
}

.community-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-commune {
  font-size: 13px;
  color: #64748b;
}

.community-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.community-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.community-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #64748b;
}

.community-actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.detail-header {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.detail-header h3 {
  margin: 16px 0 8px 0;
  font-size: 18px;
  color: #1e293b;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
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

  .community-actions {
    flex-wrap: wrap;
  }
}
</style>
