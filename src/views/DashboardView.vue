<!-- src/views/DashboardView.vue -->
<!-- Dashboard principal avec toutes les fonctionnalités -->

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSecurityStore } from '@/stores/security'

import { 
  Location, 
  User, 
  Bell, 
  Calendar,
  Warning,
  CircleCheck,
  CircleClose,
  Clock,
  Menu as IconMenu,
  Setting,
  SwitchButton
} from '@element-plus/icons-vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

// Utiliser le store (gestion d'état)
const store = useSecurityStore()

// État local du composant
const sidebarCollapsed = ref(false)

// Configuration du graphique
const chartData = computed(() => ({
  labels: store.incidentsData.map(d => d.date),
  datasets: [
    {
      label: 'Incidents',
      backgroundColor: '#409EFF',
      borderColor: '#409EFF',
      data: store.incidentsData.map(d => d.count),
      tension: 0.4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Fonction pour obtenir la couleur selon le statut
const getStatusType = (status: string) => {
  if (status === 'active') return 'success'
  if (status === 'en_mission') return 'primary'
  return 'info'
}

// Fonction pour obtenir le texte du statut
const getStatusText = (status: string) => {
  if (status === 'active') return 'Actif'
  if (status === 'en_mission') return 'En Mission'
  return 'Inactif'
}

// Fonction pour obtenir le type d'alerte
const getAlertType = (type: string) => {
  if (type === 'urgence') return 'danger'
  if (type === 'vigilance') return 'warning'
  return 'info'
}

// Fonction pour obtenir le type de zone
const getZoneType = (level: string) => {
  if (level === 'secure') return 'success'
  if (level === 'moderate') return 'warning'
  return 'danger'
}

const getZoneText = (level: string) => {
  if (level === 'secure') return 'Sécurisé'
  if (level === 'moderate') return 'Modéré'
  return 'Danger'
}
</script>

<template>
  <div class="dashboard-wrapper">
    <el-container class="dashboard-container">
      <!-- Sidebar -->
      <el-aside :width="sidebarCollapsed ? '64px' : '250px'" class="sidebar">
        <div class="sidebar-header">
          <div v-if="!sidebarCollapsed" class="logo">
            <el-icon :size="24"><Location /></el-icon>
            <span class="logo-text">Alpha-Sécurity</span>
          </div>
          <el-button 
            :icon="IconMenu" 
            circle 
            @click="sidebarCollapsed = !sidebarCollapsed"
          />
        </div>

        <el-menu 
          default-active="1" 
          class="sidebar-menu"
          :collapse="sidebarCollapsed"
        >
          <el-menu-item index="1">
            <el-icon><Location /></el-icon>
            <template #title>Dashboard</template>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><User /></el-icon>
            <template #title>Agents</template>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Location /></el-icon>
            <template #title>Zones</template>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><Bell /></el-icon>
            <template #title>Alertes</template>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><Calendar /></el-icon>
            <template #title>Réservations</template>
          </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">
          <el-menu :collapse="sidebarCollapsed">
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <template #title>Paramètres</template>
            </el-menu-item>
            <el-menu-item index="logout">
              <el-icon><SwitchButton /></el-icon>
              <template #title>Déconnexion</template>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>

      <!-- Main Content -->
      <el-container class="main-container">
        <!-- Header -->
        <el-header height="70px" class="main-header">
          <div class="header-left">
            <h1 class="header-title">Tableau de board</h1>
            <p class="header-subtitle">Abidjan, district d'Abidjan • Lundi 05 Janvier 2026</p>
          </div>
          <div class="header-right">
            <el-badge :value="store.urgentAlerts" class="notification-badge">
              <el-button :icon="Bell" circle />
            </el-badge>
            <el-avatar class="user-avatar">A</el-avatar>
          </div>
        </el-header>

        <!-- Main Content Area -->
        <el-main class="main-content">
          <!-- Cartes de Statistiques -->
          <el-row :gutter="20" class="stats-row">
            <el-col :xs="24" :sm="12" :lg="6">
              <el-card class="stat-card stat-card-blue" shadow="hover">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Agents Actifs</p>
                    <h2 class="stat-value">{{ store.activeAgents }}</h2>
                    <p class="stat-subtitle">Sur {{ store.totalAgents }} agents</p>
                  </div>
                  <div class="stat-icon">
                    <el-icon :size="40"><User /></el-icon>
                  </div>
                </div>
                <div class="stat-trend">
                  <el-tag type="success" size="small">+12%</el-tag>
                  <span>vs semaine dernière</span>
                </div>
              </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="6">
              <el-card class="stat-card stat-card-red" shadow="hover">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Alertes Actives</p>
                    <h2 class="stat-value">{{ store.totalAlerts }}</h2>
                    <p class="stat-subtitle">{{ store.urgentAlerts }} urgentes</p>
                  </div>
                  <div class="stat-icon">
                    <el-icon :size="40"><Warning /></el-icon>
                  </div>
                </div>
                <div class="stat-trend">
                  <el-tag type="success" size="small">-8%</el-tag>
                  <span>vs semaine dernière</span>
                </div>
              </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="6">
              <el-card class="stat-card stat-card-green" shadow="hover">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Zones Surveillées</p>
                    <h2 class="stat-value">{{ store.zonesMonitored }}</h2>
                    <p class="stat-subtitle">{{ store.secureZones }} zones sécurisées</p>
                  </div>
                  <div class="stat-icon">
                    <el-icon :size="40"><Location /></el-icon>
                  </div>
                </div>
                <div class="stat-trend">
                  <el-tag type="success" size="small">+5%</el-tag>
                  <span>vs semaine dernière</span>
                </div>
              </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :lg="6">
              <el-card class="stat-card stat-card-purple" shadow="hover">
                <div class="stat-content">
                  <div class="stat-info">
                    <p class="stat-label">Réservations</p>
                    <h2 class="stat-value">{{ store.reservationsToday }}</h2>
                    <p class="stat-subtitle">Aujourd'hui</p>
                  </div>
                  <div class="stat-icon">
                    <el-icon :size="40"><Calendar /></el-icon>
                  </div>
                </div>
                <div class="stat-trend">
                  <el-tag type="success" size="small">+23%</el-tag>
                  <span>vs semaine dernière</span>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- Graphique et Zones -->
          <el-row :gutter="20" class="charts-row">
            <el-col :xs="24" :lg="12">
              <el-card shadow="hover">
                <template #header>
                  <h3 class="card-title">Incidents cette semaine</h3>
                </template>
                <div class="chart-container">
                  <Line :data="chartData" :options="chartOptions" />
                </div>
              </el-card>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-card shadow="hover">
                <template #header>
                  <h3 class="card-title">Zones de Sécurité</h3>
                </template>
                <el-row :gutter="15">
                  <el-col 
                    v-for="zone in store.zones" 
                    :key="zone.id" 
                    :xs="12" 
                    :sm="8"
                    class="zone-col"
                  >
                    <div class="zone-card">
                      <div class="zone-header">
                        <span class="zone-name">{{ zone.name }}</span>
                        <span 
                          class="zone-indicator" 
                          :style="{ backgroundColor: zone.color }"
                        ></span>
                      </div>
                      <div class="zone-footer">
                        <span class="zone-agents">{{ zone.agentsCount }} agents</span>
                        <el-tag 
                          :type="getZoneType(zone.level)" 
                          size="small"
                        >
                          {{ getZoneText(zone.level) }}
                        </el-tag>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>

          <!-- Agents et Alertes -->
          <el-row :gutter="20" class="data-row">
            <el-col :xs="24" :lg="16">
              <el-card shadow="hover">
                <template #header>
                  <h3 class="card-title">Agents en Temps Réel</h3>
                </template>
                <el-table :data="store.agents" style="width: 100%">
                  <el-table-column label="Agent" min-width="180">
                    <template #default="{ row }">
                      <div class="agent-cell">
                        <el-avatar :src="row.avatar" />
                        <span class="agent-name">{{ row.name }}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="Statut" width="140">
                    <template #default="{ row }">
                      <el-tag :type="getStatusType(row.status)">
                        <el-icon v-if="row.status === 'active'"><CircleCheck /></el-icon>
                        <el-icon v-else-if="row.status === 'en_mission'"><Clock /></el-icon>
                        <el-icon v-else><CircleClose /></el-icon>
                        {{ getStatusText(row.status) }}
                      </el-tag>
                    </template>
                  </el-table-column>

                  <el-table-column prop="zone" label="Zone" width="120" />
                  <el-table-column prop="phone" label="Contact" min-width="150" />
                </el-table>
              </el-card>
            </el-col>

            <el-col :xs="24" :lg="8">
              <el-card shadow="hover">
                <template #header>
                  <h3 class="card-title">Alertes Récentes</h3>
                </template>
                <div class="alerts-container">
                  <el-alert
                    v-for="alert in store.alerts"
                    :key="alert.id"
                    :title="alert.message"
                    :type="getAlertType(alert.type)"
                    :closable="false"
                    class="alert-item"
                  >
                    <template #default>
                      <p class="alert-details">{{ alert.zone }} • {{ alert.time }}</p>
                    </template>
                  </el-alert>
                </div>
                <el-button type="primary" text class="view-all-btn">
                  Voir toutes les alertes →
                </el-button>
              </el-card>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* Fix pour prendre toute la hauteur */
.dashboard-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.dashboard-container {
  height: 100%;
  width: 100%;
}

.main-container {
  height: 100%;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  background: linear-gradient(180deg, #02b95a 0%, rgb(27, 236, 66) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
}

.sidebar-menu {
  flex: 1;
  border: none;
  background: transparent;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.8);
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

/* Header */
.main-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  flex-shrink: 0;
}

.header-left {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  color: #1f2937;
}

.header-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 5px 0 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-badge :deep(.el-badge__content) {
  background-color: #ef4444;
}

.user-avatar {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  font-weight: bold;
}

/* Main Content */
.main-content {
  background: #f9fafb;
  padding: 30px;
  height: calc(100vh - 70px);
  overflow-y: auto;
  overflow-x: hidden;
}

.stats-row,
.charts-row,
.data-row {
  margin-bottom: 20px;
}

/* Stat Cards */
.stat-card {
  height: 100%;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 5px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 5px 0;
}

.stat-subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.stat-icon {
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card-blue .stat-icon {
  background: #3b82f6;
  color: white;
}

.stat-card-red .stat-icon {
  background: #ef4444;
  color: white;
}

.stat-card-green .stat-icon {
  background: #10b981;
  color: white;
}

.stat-card-purple .stat-icon {
  background: #8b5cf6;
  color: white;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

/* Chart */
.chart-container {
  height: 300px;
  padding: 10px 0;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
}

/* Zones */
.zone-col {
  margin-bottom: 15px;
}

.zone-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  transition: all 0.3s;
  background: white;
}

.zone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.zone-name {
  font-weight: 600;
  color: #1f2937;
}

.zone-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.zone-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.zone-agents {
  color: #6b7280;
}

/* Agents Table */
.agent-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-name {
  font-weight: 500;
  color: #1f2937;
}

/* Alerts */
.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.alert-item {
  border-left-width: 4px;
}

.alert-details {
  font-size: 12px;
  color: #6b7280;
  margin: 5px 0 0 0;
}

.view-all-btn {
  width: 100%;
  margin-top: 10px;
}

/* Scrollbar personnalisée */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.main-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive */
@media (max-width: 768px) {
  .main-header {
    padding: 0 15px;
  }

  .main-content {
    padding: 15px;
  }

  .header-title {
    font-size: 18px;
  }

  .header-subtitle {
    font-size: 12px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>