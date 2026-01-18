<template>
  <div class="dashboard-view">
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Vue d'ensemble de l'activite</p>
    </div>

    <!-- Stats Cards - First Row -->
    <div class="stats-grid">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon users">
            <el-icon :size="24"><User /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.users?.total || 0 }}</span>
            <span class="stat-label">Utilisateurs</span>
          </div>
        </div>
        <div class="stat-footer">
          <span class="stat-change positive">+{{ stats?.users?.new_this_month || 0 }}</span>
          <span class="stat-period">ce mois</span>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon agents">
            <el-icon :size="24"><Avatar /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.agents?.total || 0 }}</span>
            <span class="stat-label">Agents</span>
          </div>
        </div>
        <div class="stat-footer">
          <el-tag type="warning" size="small">{{ stats?.agents?.pending_approval || 0 }} en attente</el-tag>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon missions">
            <el-icon :size="24"><Briefcase /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.missions?.total || 0 }}</span>
            <span class="stat-label">Missions</span>
          </div>
        </div>
        <div class="stat-footer">
          <span class="stat-change">{{ stats?.missions?.in_progress || 0 }} en cours</span>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon revenue">
            <el-icon :size="24"><Money /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ formatCurrency(stats?.missions?.revenue_this_month || 0) }}</span>
            <span class="stat-label">Revenus (mois)</span>
          </div>
        </div>
        <div class="stat-footer">
          <span class="stat-change">Total: {{ formatCurrency(stats?.missions?.revenue_total || 0) }}</span>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon communities">
            <el-icon :size="24"><OfficeBuilding /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.communities?.total || 0 }}</span>
            <span class="stat-label">Communautes</span>
          </div>
        </div>
        <div class="stat-footer">
          <span class="stat-change">{{ stats?.communities?.total_members || 0 }} membres</span>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon incidents">
            <el-icon :size="24"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats?.incidents?.total || 0 }}</span>
            <span class="stat-label">Incidents</span>
          </div>
        </div>
        <div class="stat-footer">
          <el-tag type="danger" size="small">{{ stats?.incidents?.critical || 0 }} critiques</el-tag>
          <el-tag type="warning" size="small" style="margin-left: 4px">{{ stats?.incidents?.open || 0 }} ouverts</el-tag>
        </div>
      </el-card>
    </div>

    <!-- Charts & Activity -->
    <div class="charts-grid">
      <el-card class="chart-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>Missions par mois</span>
            <el-select v-model="chartPeriod" size="small" style="width: 120px">
              <el-option label="6 mois" value="6" />
              <el-option label="12 mois" value="12" />
            </el-select>
          </div>
        </template>
        <div class="chart-container">
          <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
          <el-empty v-else description="Aucune donnee" />
        </div>
      </el-card>

      <el-card class="activity-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>Activite recente</span>
            <el-link type="primary" :underline="false">Voir tout</el-link>
          </div>
        </template>
        <div class="activity-list">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon" :class="activity.type">
              <el-icon :size="16">
                <component :is="getActivityIcon(activity.type)" />
              </el-icon>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.description }}</p>
              <span class="activity-time">{{ formatDate(activity.created_at) }}</span>
            </div>
          </div>
          <el-empty v-if="recentActivity.length === 0" description="Aucune activite recente" :image-size="80" />
        </div>
      </el-card>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <el-icon class="is-loading" :size="40"><Loading /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '@/stores'
import {
  User,
  Avatar,
  Briefcase,
  Money,
  OfficeBuilding,
  Warning,
  Loading,
  UserFilled,
  Checked,
  Plus,
  Bell,
} from '@element-plus/icons-vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const dashboardStore = useDashboardStore()

const chartPeriod = ref('6')
const loading = computed(() => dashboardStore.loading)
const stats = computed(() => dashboardStore.stats)
const recentActivity = computed(() => dashboardStore.recentActivity)

const chartData = computed(() => {
  return {
    labels: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Missions',
        backgroundColor: '#2d8a4e',
        data: [12, 19, 15, 25, 22, 30],
      },
      {
        label: 'Revenus (x1000)',
        backgroundColor: '#3b82f6',
        data: [8, 15, 12, 20, 18, 25],
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(value)
}

function formatDate(date: string): string {
  return new Intl.RelativeTimeFormat('fr', { numeric: 'auto' }).format(
    Math.round((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day',
  )
}

function getActivityIcon(type: string) {
  const icons: Record<string, typeof User> = {
    user_registered: UserFilled,
    agent_approved: Checked,
    mission_created: Plus,
    incident_reported: Warning,
    payment_received: Money,
  }
  return icons[type] || Bell
}

onMounted(async () => {
  await dashboardStore.fetchAll()
})
</script>

<style scoped>
.dashboard-view {
  position: relative;
  padding: 0;
  width: 100%;
  max-width: 100%;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1400px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  height: 100%;
}

.stat-card :deep(.el-card__body) {
  padding: 18px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  flex-shrink: 0;
}

.stat-icon.users {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.stat-icon.agents {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
}

.stat-icon.missions {
  background: linear-gradient(135deg, #2d8a4e, #1a5530);
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.stat-icon.communities {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.stat-icon.incidents {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.stat-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
}

.stat-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.stat-change {
  font-size: 13px;
  color: #64748b;
}

.stat-change.positive {
  color: #2d8a4e;
  font-weight: 500;
}

.stat-period {
  font-size: 13px;
  color: #94a3b8;
  margin-left: 4px;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 992px) {
  .charts-grid {
    grid-template-columns: 1.5fr 1fr;
  }
}

.chart-card,
.activity-card {
  min-height: 380px;
}

.chart-card :deep(.el-card__body),
.activity-card :deep(.el-card__body) {
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
}

.chart-container {
  height: 280px;
  width: 100%;
}

.activity-list {
  height: 280px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.user_registered {
  background-color: #dbeafe;
  color: #3b82f6;
}

.activity-icon.agent_approved {
  background-color: #d1fae5;
  color: #2d8a4e;
}

.activity-icon.mission_created {
  background-color: #fef3c7;
  color: #f59e0b;
}

.activity-icon.incident_reported {
  background-color: #fee2e2;
  color: #ef4444;
}

.activity-icon.payment_received {
  background-color: #e0e7ff;
  color: #6366f1;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 14px;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.activity-time {
  font-size: 12px;
  color: #94a3b8;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}
</style>
