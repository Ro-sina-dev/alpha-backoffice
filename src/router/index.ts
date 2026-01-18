import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores'

// Layouts
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth routes
    {
      path: '/login',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { requiresGuest: true },
        },
      ],
    },

    // Main app routes (require authentication)
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },

        // Users
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/users/UsersListView.vue'),
          meta: { title: 'Utilisateurs' },
        },

        // Agents
        {
          path: 'agents',
          name: 'agents',
          component: () => import('@/views/agents/AgentsListView.vue'),
          meta: { title: 'Agents' },
        },
        {
          path: 'agents/pending',
          name: 'agents-pending',
          component: () => import('@/views/agents/AgentsListView.vue'),
          meta: { title: 'Agents en attente' },
        },

        // Missions
        {
          path: 'missions',
          name: 'missions',
          component: () => import('@/views/missions/MissionsListView.vue'),
          meta: { title: 'Missions' },
        },

        // Communities
        {
          path: 'communities',
          name: 'communities',
          component: () => import('@/views/communities/CommunitiesListView.vue'),
          meta: { title: 'Communautes' },
        },

        // Incidents
        {
          path: 'incidents',
          name: 'incidents',
          component: () => import('@/views/incidents/IncidentsListView.vue'),
          meta: { title: 'Incidents' },
        },

        // Reference data
        {
          path: 'reference/communes',
          name: 'reference-communes',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Communes' },
        },
        {
          path: 'reference/types-missions',
          name: 'reference-types-missions',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Types de Missions' },
        },
        {
          path: 'reference/sous-types-missions',
          name: 'reference-sous-types-missions',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Sous-types de Missions' },
        },
        {
          path: 'reference/equipements',
          name: 'reference-equipements',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Equipements' },
        },
        {
          path: 'reference/certifications',
          name: 'reference-certifications',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Certifications' },
        },
        {
          path: 'reference/specialisations',
          name: 'reference-specialisations',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Specialisations' },
        },
        {
          path: 'reference/types-incidents',
          name: 'reference-types-incidents',
          component: () => import('@/views/reference/ReferenceListView.vue'),
          meta: { title: 'Types d\'Incidents' },
        },

        // Settings
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/settings/SettingsView.vue'),
          meta: { title: 'Parametres' },
        },
      ],
    },

    // 404 Catch-all
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Try to get current user if token exists
      const token = localStorage.getItem('access_token')
      if (token) {
        try {
          await authStore.fetchCurrentUser()
          if (authStore.isAuthenticated) {
            next()
            return
          }
        } catch {
          // Token invalid, redirect to login
        }
      }
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }
  }

  // Check if route requires guest (login page)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
