<template>
  <div class="reference-list-view">
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-subtitle">Gestion des donnees de reference</p>
      </div>
      <div class="page-header-right">
        <el-button type="primary" :icon="Plus" @click="openCreateDialog">
          Ajouter
        </el-button>
      </div>
    </div>

    <!-- Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="items"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column label="Nom" prop="name" min-width="200" />

        <el-table-column v-if="hasCode" label="Code" prop="code" width="150" />

        <el-table-column v-if="hasDescription" label="Description" prop="description" min-width="250">
          <template #default="{ row }">
            {{ row.description || '-' }}
          </template>
        </el-table-column>

        <el-table-column v-if="hasPrice" label="Prix" width="120">
          <template #default="{ row }">
            {{ row.price ? formatCurrency(row.price) : '-' }}
          </template>
        </el-table-column>

        <el-table-column v-if="hasParent" label="Type Mission" width="180">
          <template #default="{ row }">
            {{ row.type_mission?.name || '-' }}
          </template>
        </el-table-column>

        <el-table-column v-if="hasColor" label="Couleur" width="100">
          <template #default="{ row }">
            <div v-if="row.color" class="color-preview" :style="{ backgroundColor: row.color }"></div>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column v-if="hasActive" label="Actif" width="100">
          <template #default="{ row }">
            <el-switch
              :model-value="row.is_active"
              @change="() => toggleActive(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" :icon="Edit" @click="openEditDialog(row)" />
              <el-button size="small" type="danger" :icon="Delete" @click="deleteItem(row)" />
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="showDialog"
      :title="isEditing ? 'Modifier' : 'Ajouter'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item label="Nom" prop="name">
          <el-input v-model="form.name" placeholder="Nom" />
        </el-form-item>

        <el-form-item v-if="hasCode" label="Code" prop="code">
          <el-input v-model="form.code" placeholder="Code unique" />
        </el-form-item>

        <el-form-item v-if="hasDescription" label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="Description..."
          />
        </el-form-item>

        <el-form-item v-if="hasPrice" label="Prix (FCFA)" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="100" style="width: 100%" />
        </el-form-item>

        <el-form-item v-if="hasParent" label="Type de Mission" prop="type_mission_id">
          <el-select v-model="form.type_mission_id" placeholder="Selectionnez" style="width: 100%">
            <el-option
              v-for="type in typesMissions"
              :key="type.id"
              :label="type.name"
              :value="type.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="hasColor" label="Couleur" prop="color">
          <el-color-picker v-model="form.color" />
        </el-form-item>

        <el-form-item v-if="hasIcon" label="Icone" prop="icon">
          <el-input v-model="form.icon" placeholder="Nom de l'icone" />
        </el-form-item>

        <el-form-item v-if="hasActive" label="Actif">
          <el-switch v-model="form.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">Annuler</el-button>
        <el-button type="primary" :loading="saving" @click="submitForm">
          {{ isEditing ? 'Enregistrer' : 'Creer' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useReferenceStore } from '@/stores'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'

type ReferenceType = 'communes' | 'types-missions' | 'sous-types-missions' | 'equipements' | 'certifications' | 'specialisations' | 'types-incidents'
interface ReferenceItem {
  id: string
  name: string
  code?: string
  description?: string
  price?: number
  color?: string
  icon?: string
  is_active?: boolean
  type_mission_id?: string
  type_mission?: { id: string; name: string }
}

const route = useRoute()
const referenceStore = useReferenceStore()

const showDialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const selectedItem = ref<ReferenceItem | null>(null)
const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  code: '',
  description: '',
  price: 0,
  color: '',
  icon: '',
  is_active: true,
  type_mission_id: '',
})

const referenceType = computed<ReferenceType>(() => {
  const path = route.path.split('/').pop() || 'communes'
  return path as ReferenceType
})

const pageTitle = computed(() => {
  const titles: Record<ReferenceType, string> = {
    communes: 'Communes',
    'types-missions': 'Types de Missions',
    'sous-types-missions': 'Sous-types de Missions',
    equipements: 'Equipements',
    certifications: 'Certifications',
    specialisations: 'Specialisations',
    'types-incidents': 'Types d\'Incidents',
  }
  return titles[referenceType.value] || 'References'
})

const loading = computed(() => referenceStore.loading)
const typesMissions = computed(() => referenceStore.typesMissions)

const items = computed<ReferenceItem[]>(() => {
  switch (referenceType.value) {
    case 'communes':
      return referenceStore.communes as ReferenceItem[]
    case 'types-missions':
      return referenceStore.typesMissions as ReferenceItem[]
    case 'sous-types-missions':
      return referenceStore.sousTypesMissions as ReferenceItem[]
    case 'equipements':
      return referenceStore.equipements as ReferenceItem[]
    case 'certifications':
      return referenceStore.certifications as ReferenceItem[]
    case 'specialisations':
      return referenceStore.specialisations as ReferenceItem[]
    case 'types-incidents':
      return referenceStore.typesIncidents as ReferenceItem[]
    default:
      return []
  }
})

const hasCode = computed(() => referenceType.value === 'communes')
const hasDescription = computed(() => ['types-missions', 'sous-types-missions', 'equipements', 'certifications', 'specialisations', 'types-incidents'].includes(referenceType.value))
const hasPrice = computed(() => referenceType.value === 'equipements')
const hasParent = computed(() => referenceType.value === 'sous-types-missions')
const hasColor = computed(() => referenceType.value === 'types-incidents')
const hasIcon = computed(() => referenceType.value === 'types-incidents')
const hasActive = computed(() => referenceType.value !== 'communes')

const formRules = computed<FormRules>(() => {
  const rules: FormRules = {
    name: [{ required: true, message: 'Le nom est requis', trigger: 'blur' }],
  }
  if (hasCode.value) {
    rules.code = [{ required: true, message: 'Le code est requis', trigger: 'blur' }]
  }
  if (hasParent.value) {
    rules.type_mission_id = [{ required: true, message: 'Le type de mission est requis', trigger: 'change' }]
  }
  return rules
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' F'
}

function openCreateDialog() {
  isEditing.value = false
  selectedItem.value = null
  resetForm()
  showDialog.value = true
}

function openEditDialog(item: ReferenceItem) {
  isEditing.value = true
  selectedItem.value = item
  form.name = item.name
  form.code = item.code || ''
  form.description = item.description || ''
  form.price = item.price || 0
  form.color = item.color || ''
  form.icon = item.icon || ''
  form.is_active = item.is_active !== false
  form.type_mission_id = item.type_mission_id || ''
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  resetForm()
}

function resetForm() {
  form.name = ''
  form.code = ''
  form.description = ''
  form.price = 0
  form.color = ''
  form.icon = ''
  form.is_active = true
  form.type_mission_id = ''
}

async function submitForm() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saving.value = true
    try {
      const data: Record<string, unknown> = { name: form.name }
      if (hasCode.value) data.code = form.code
      if (hasDescription.value) data.description = form.description
      if (hasPrice.value) data.price = form.price
      if (hasColor.value) data.color = form.color
      if (hasIcon.value) data.icon = form.icon
      if (hasActive.value) data.is_active = form.is_active
      if (hasParent.value) data.type_mission_id = form.type_mission_id

      if (isEditing.value && selectedItem.value) {
        await updateItem(selectedItem.value.id, data)
        ElMessage.success('Element mis a jour')
      } else {
        await createItem(data)
        ElMessage.success('Element cree')
      }
      closeDialog()
    } catch {
      ElMessage.error('Erreur')
    } finally {
      saving.value = false
    }
  })
}

async function createItem(data: Record<string, unknown>) {
  switch (referenceType.value) {
    case 'communes':
      await referenceStore.createCommune(data as { name: string; code: string })
      break
    case 'types-missions':
      await referenceStore.createTypeMission(data as { name: string; description?: string; is_active?: boolean })
      break
    case 'sous-types-missions':
      await referenceStore.createSousTypeMission(data as { name: string; description?: string; type_mission_id: string; is_active?: boolean })
      break
    case 'equipements':
      await referenceStore.createEquipement(data as { name: string; description?: string; price?: number; is_active?: boolean })
      break
    case 'certifications':
      await referenceStore.createCertification(data as { name: string; description?: string; is_active?: boolean })
      break
    case 'specialisations':
      await referenceStore.createSpecialisation(data as { name: string; description?: string; is_active?: boolean })
      break
    case 'types-incidents':
      await referenceStore.createTypeIncident(data as { name: string; description?: string; icon?: string; color?: string; is_active?: boolean })
      break
  }
}

async function updateItem(id: string, data: Record<string, unknown>) {
  switch (referenceType.value) {
    case 'communes':
      await referenceStore.updateCommune(id, data as { name?: string; code?: string })
      break
    case 'types-missions':
      await referenceStore.updateTypeMission(id, data as { name?: string; description?: string; is_active?: boolean })
      break
    case 'sous-types-missions':
      await referenceStore.updateSousTypeMission(id, data as { name?: string; description?: string; type_mission_id?: string; is_active?: boolean })
      break
    case 'equipements':
      await referenceStore.updateEquipement(id, data as { name?: string; description?: string; price?: number; is_active?: boolean })
      break
    case 'certifications':
      await referenceStore.updateCertification(id, data as { name?: string; description?: string; is_active?: boolean })
      break
    case 'specialisations':
      await referenceStore.updateSpecialisation(id, data as { name?: string; description?: string; is_active?: boolean })
      break
    case 'types-incidents':
      await referenceStore.updateTypeIncident(id, data as { name?: string; description?: string; icon?: string; color?: string; is_active?: boolean })
      break
  }
}

async function toggleActive(item: ReferenceItem) {
  try {
    await updateItem(item.id, { is_active: !item.is_active })
    ElMessage.success('Statut mis a jour')
  } catch {
    ElMessage.error('Erreur')
  }
}

async function deleteItem(item: ReferenceItem) {
  ElMessageBox.confirm(
    'Voulez-vous vraiment supprimer cet element ?',
    'Confirmation',
    {
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      type: 'warning',
    },
  ).then(async () => {
    try {
      switch (referenceType.value) {
        case 'communes':
          await referenceStore.deleteCommune(item.id)
          break
        case 'types-missions':
          await referenceStore.deleteTypeMission(item.id)
          break
        case 'sous-types-missions':
          await referenceStore.deleteSousTypeMission(item.id)
          break
        case 'equipements':
          await referenceStore.deleteEquipement(item.id)
          break
        case 'certifications':
          await referenceStore.deleteCertification(item.id)
          break
        case 'specialisations':
          await referenceStore.deleteSpecialisation(item.id)
          break
        case 'types-incidents':
          await referenceStore.deleteTypeIncident(item.id)
          break
      }
      ElMessage.success('Element supprime')
    } catch {
      ElMessage.error('Erreur lors de la suppression')
    }
  }).catch(() => {})
}

async function fetchData() {
  switch (referenceType.value) {
    case 'communes':
      await referenceStore.fetchCommunes()
      break
    case 'types-missions':
      await referenceStore.fetchTypesMissions()
      break
    case 'sous-types-missions':
      await Promise.all([referenceStore.fetchSousTypesMissions(), referenceStore.fetchTypesMissions()])
      break
    case 'equipements':
      await referenceStore.fetchEquipements()
      break
    case 'certifications':
      await referenceStore.fetchCertifications()
      break
    case 'specialisations':
      await referenceStore.fetchSpecialisations()
      break
    case 'types-incidents':
      await referenceStore.fetchTypesIncidents()
      break
  }
}

watch(referenceType, () => {
  fetchData()
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.reference-list-view {
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

.table-card {
  background: #ffffff;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}
</style>
