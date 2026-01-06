<template>
  <div class="users-list-view">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Utilisateurs</h1>
        <p class="page-subtitle">Gestion des utilisateurs de la plateforme</p>
      </div>
      <div class="page-header-right">
        <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
          Nouvel utilisateur
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
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="statusFilter" placeholder="Statut" clearable @change="handleFilterChange">
            <el-option label="Actif" :value="true" />
            <el-option label="Inactif" :value="false" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="roleFilter" placeholder="Role" clearable @change="handleFilterChange">
            <el-option label="Admin" value="admin" />
            <el-option label="Agent" value="agent" />
            <el-option label="Client" value="client" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="users"
        style="width: 100%"
        row-key="id"
        @sort-change="handleSortChange"
      >
        <el-table-column label="Utilisateur" min-width="250">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="40" :src="row.profile_picture_url">
                {{ getInitials(row) }}
              </el-avatar>
              <div class="user-info">
                <span class="user-name">{{ row.first_name }} {{ row.last_name }}</span>
                <span class="user-email">{{ row.email }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Telephone" prop="phone" width="150">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="Role" prop="role" width="120">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role?.slug)">
              {{ row.role?.name || 'N/A' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Statut" prop="is_active" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? 'Actif' : 'Inactif' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="Verifie" prop="is_verified" width="100">
          <template #default="{ row }">
            <el-icon v-if="row.is_verified" color="#10b981"><CircleCheckFilled /></el-icon>
            <el-icon v-else color="#94a3b8"><CircleCloseFilled /></el-icon>
          </template>
        </el-table-column>

        <el-table-column label="Date creation" prop="created_at" width="150" sortable>
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" :icon="View" @click="viewUser(row)" />
              <el-button size="small" :icon="Edit" @click="editUser(row)" />
              <el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, row)">
                <el-button size="small" :icon="MoreFilled" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="row.is_active ? 'deactivate' : 'activate'">
                      {{ row.is_active ? 'Desactiver' : 'Activer' }}
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
          :total="totalUsers"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- User Detail Dialog -->
    <el-dialog v-model="showDetailDialog" title="Details de l'utilisateur" width="600px" :fullscreen="isMobile">
      <div v-if="selectedUser" class="user-detail">
        <div class="user-detail-header">
          <el-avatar :size="80" :src="selectedUser.profile_picture_url">
            {{ getInitials(selectedUser) }}
          </el-avatar>
          <div class="user-detail-info">
            <h3>{{ selectedUser.first_name }} {{ selectedUser.last_name }}</h3>
            <p>{{ selectedUser.email }}</p>
            <el-tag :type="getRoleTagType(selectedUser.role?.slug)">
              {{ selectedUser.role?.name }}
            </el-tag>
          </div>
        </div>

        <el-descriptions :column="2" border>
          <el-descriptions-item label="Telephone">
            {{ selectedUser.phone || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="Statut">
            <el-tag :type="selectedUser.is_active ? 'success' : 'danger'">
              {{ selectedUser.is_active ? 'Actif' : 'Inactif' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Email verifie">
            {{ selectedUser.email_verified_at ? 'Oui' : 'Non' }}
          </el-descriptions-item>
          <el-descriptions-item label="Tel. verifie">
            {{ selectedUser.phone_verified_at ? 'Oui' : 'Non' }}
          </el-descriptions-item>
          <el-descriptions-item label="Date inscription">
            {{ formatDate(selectedUser.created_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="Derniere maj">
            {{ formatDate(selectedUser.updated_at) }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">Fermer</el-button>
        <el-button type="primary" @click="editUser(selectedUser!)">Modifier</el-button>
      </template>
    </el-dialog>

    <!-- Edit User Dialog -->
    <el-dialog v-model="showEditDialog" title="Modifier l'utilisateur" width="500px" :fullscreen="isMobile">
      <el-form
        v-if="editForm"
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-position="top"
      >
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="Prenom" prop="first_name">
              <el-input v-model="editForm.first_name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Nom" prop="last_name">
              <el-input v-model="editForm.last_name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email" type="email" />
        </el-form-item>
        <el-form-item label="Telephone" prop="phone">
          <el-input v-model="editForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Annuler</el-button>
        <el-button type="primary" :loading="saving" @click="saveUser">
          Enregistrer
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue'
import { useUsersStore } from '@/stores'
import {
  Plus,
  Search,
  View,
  Edit,
  MoreFilled,
  CircleCheckFilled,
  CircleCloseFilled,
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import type { User } from '@/types'

const usersStore = useUsersStore()

const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const searchQuery = ref('')
const statusFilter = ref<boolean | undefined>()
const roleFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const showDetailDialog = ref(false)
const showEditDialog = ref(false)
const showCreateDialog = ref(false)
const selectedUser = ref<User | null>(null)
const editFormRef = ref<FormInstance>()
const saving = ref(false)

const editForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
})

const editRules: FormRules = {
  first_name: [{ required: true, message: 'Le prenom est requis', trigger: 'blur' }],
  last_name: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
  email: [
    { required: true, message: 'L\'email est requis', trigger: 'blur' },
    { type: 'email', message: 'Email invalide', trigger: 'blur' },
  ],
}

const loading = computed(() => usersStore.loading)
const users = computed(() => usersStore.users)
const totalUsers = computed(() => usersStore.totalUsers)

function getInitials(user: User): string {
  return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
}

function getRoleTagType(role?: string): 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
    admin: 'danger',
    agent: 'warning',
    client: 'info',
  }
  return types[role || ''] || 'info'
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
  fetchUsers()
}

function handleFilterChange() {
  currentPage.value = 1
  fetchUsers()
}

function handleSortChange() {
  fetchUsers()
}

function handleSizeChange(size: number) {
  pageSize.value = size
  fetchUsers()
}

function handlePageChange(page: number) {
  currentPage.value = page
  fetchUsers()
}

function viewUser(user: User) {
  selectedUser.value = user
  showDetailDialog.value = true
}

function editUser(user: User) {
  selectedUser.value = user
  editForm.first_name = user.first_name
  editForm.last_name = user.last_name
  editForm.email = user.email
  editForm.phone = user.phone || ''
  showDetailDialog.value = false
  showEditDialog.value = true
}

async function saveUser() {
  if (!editFormRef.value || !selectedUser.value) return

  await editFormRef.value.validate(async (valid) => {
    if (!valid) return

    saving.value = true
    try {
      await usersStore.updateUser(selectedUser.value!.id, {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        phone: editForm.phone || undefined,
      })
      ElMessage.success('Utilisateur mis a jour')
      showEditDialog.value = false
    } catch {
      ElMessage.error('Erreur lors de la mise a jour')
    } finally {
      saving.value = false
    }
  })
}

async function handleCommand(command: string, user: User) {
  switch (command) {
    case 'activate':
    case 'deactivate':
      try {
        await usersStore.toggleUserStatus(user.id)
        ElMessage.success(`Utilisateur ${command === 'activate' ? 'active' : 'desactive'}`)
      } catch {
        ElMessage.error('Erreur lors du changement de statut')
      }
      break
    case 'delete':
      ElMessageBox.confirm(
        'Voulez-vous vraiment supprimer cet utilisateur ?',
        'Confirmation',
        {
          confirmButtonText: 'Supprimer',
          cancelButtonText: 'Annuler',
          type: 'warning',
        },
      ).then(async () => {
        try {
          await usersStore.deleteUser(user.id)
          ElMessage.success('Utilisateur supprime')
        } catch {
          ElMessage.error('Erreur lors de la suppression')
        }
      }).catch(() => {})
      break
  }
}

async function fetchUsers() {
  await usersStore.fetchUsers({
    page: currentPage.value,
    per_page: pageSize.value,
    search: searchQuery.value || undefined,
    is_active: statusFilter.value,
    role_id: roleFilter.value || undefined,
  })
}

onMounted(() => {
  fetchUsers()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})
</script>

<style scoped>
.users-list-view {
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

.table-card {
  background: #ffffff;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
}

.user-email {
  font-size: 13px;
  color: #64748b;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.user-detail-info h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  color: #1e293b;
}

.user-detail-info p {
  margin: 0 0 8px 0;
  color: #64748b;
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
}
</style>
