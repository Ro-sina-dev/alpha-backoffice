<template>
  <el-container class="main-layout">
    <!-- Mobile Overlay -->
    <div v-if="isMobile && sidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <el-aside
      :width="isMobile ? '260px' : (isCollapsed ? '64px' : '260px')"
      class="sidebar"
      :class="{ 'sidebar-mobile': isMobile, 'sidebar-open': sidebarOpen }"
    >
      <div class="logo">
        <img src="@/assets/logo_alph.png" alt="Alph" class="logo-img" />
        <span v-if="!isCollapsed" class="logo-text">Alph Backoffice</span>
      </div>

      <el-scrollbar class="menu-scrollbar">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapsed"
          :router="true"
          class="sidebar-menu"
          background-color="#1e293b"
          text-color="#94a3b8"
          active-text-color="#ffffff"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>Dashboard</template>
          </el-menu-item>

          <el-sub-menu index="users-menu">
            <template #title>
              <el-icon><User /></el-icon>
              <span>Utilisateurs</span>
            </template>
            <el-menu-item index="/users">Liste</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="agents-menu">
            <template #title>
              <el-icon><Avatar /></el-icon>
              <span>Agents</span>
            </template>
            <el-menu-item index="/agents">Liste</el-menu-item>
            <el-menu-item index="/agents/pending">En attente</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="missions-menu">
            <template #title>
              <el-icon><Briefcase /></el-icon>
              <span>Missions</span>
            </template>
            <el-menu-item index="/missions">Liste</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="communities-menu">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>Communautes</span>
            </template>
            <el-menu-item index="/communities">Liste</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="incidents-menu">
            <template #title>
              <el-icon><Warning /></el-icon>
              <span>Incidents</span>
            </template>
            <el-menu-item index="/incidents">Liste</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="reference-menu">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>References</span>
            </template>
            <el-menu-item index="/reference/communes">Communes</el-menu-item>
            <el-menu-item index="/reference/types-missions">Types Missions</el-menu-item>
            <el-menu-item index="/reference/equipements">Equipements</el-menu-item>
            <el-menu-item index="/reference/certifications">Certifications</el-menu-item>
            <el-menu-item index="/reference/specialisations">Specialisations</el-menu-item>
            <el-menu-item index="/reference/types-incidents">Types Incidents</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <template #title>Parametres</template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- Main Content -->
    <el-container class="content-container">
      <!-- Header -->
      <el-header class="header">
        <div class="header-left">
          <el-button :icon="isCollapsed ? Expand : Fold" text @click="toggleSidebar" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">Accueil</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              {{ item.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-badge :value="notificationCount" :hidden="notificationCount === 0" class="notification-badge">
            <el-button :icon="Bell" text circle />
          </el-badge>

          <el-dropdown trigger="click" @command="handleUserCommand">
            <div class="user-dropdown">
              <el-avatar :size="36" :src="userAvatar">
                {{ userInitials }}
              </el-avatar>
              <div class="user-info">
                <span class="user-name">{{ userFullName }}</span>
                <span class="user-role">{{ userRole }}</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">Mon profil</el-dropdown-item>
                <el-dropdown-item command="settings">Parametres</el-dropdown-item>
                <el-dropdown-item divided command="logout">Deconnexion</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content Area -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import {
  DataAnalysis,
  User,
  Avatar,
  Briefcase,
  OfficeBuilding,
  Warning,
  Document,
  Setting,
  Expand,
  Fold,
  Bell,
  ArrowDown,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const isMobile = ref(false)
const sidebarOpen = ref(false)
const notificationCount = ref(0)

function checkMobile() {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const activeMenu = computed(() => route.path)
const userFullName = computed(() => authStore.userFullName || 'Admin')
const userInitials = computed(() => authStore.userInitials || 'A')
const userAvatar = computed(() => authStore.user?.profile_picture_url || '')
const userRole = computed(() => authStore.userRole || 'Administrateur')

const breadcrumbs = computed(() => {
  const matched = route.matched.filter((item) => item.meta?.title)
  return matched.map((item) => ({
    path: item.path,
    title: item.meta?.title as string,
  }))
})

function toggleSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = !sidebarOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}

function closeSidebar() {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

async function handleUserCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      await authStore.logout()
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
}

.sidebar {
  background-color: #1e293b;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  padding: 20px 16px;
  gap: 12px;
  border-bottom: 1px solid #334155;
  flex-shrink: 0;
}

.logo-img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.logo-text {
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  white-space: nowrap;
}

.menu-scrollbar {
  flex: 1;
  overflow: hidden;
}

.sidebar-menu {
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 260px;
}

.sidebar-menu .el-menu-item,
.sidebar-menu :deep(.el-sub-menu__title) {
  height: 50px;
  line-height: 50px;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #2d8a4e !important;
}

.sidebar-menu :deep(.el-sub-menu .el-menu-item) {
  padding-left: 56px !important;
  height: 44px;
  line-height: 44px;
}

.content-container {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
  height: 64px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  margin-right: 8px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 10px;
  transition: background-color 0.2s;
}

.user-dropdown:hover {
  background-color: #f3f4f6;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.2;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

.main-content {
  background-color: #f1f5f9;
  padding: 20px 24px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  min-width: 0;
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Mobile Sidebar */
.sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.sidebar-mobile.sidebar-open {
  transform: translateX(0);
}

/* Responsive */
@media (max-width: 768px) {
  .user-info {
    display: none;
  }

  .header {
    padding: 0 16px;
  }

  .header-left {
    gap: 8px;
  }

  .main-content {
    padding: 16px;
  }

  .el-breadcrumb {
    display: none;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 12px;
  }

  .header {
    padding: 0 12px;
  }

  .notification-badge {
    margin-right: 4px;
  }

  .header-right {
    gap: 8px;
  }
}
</style>
