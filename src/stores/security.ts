// src/stores/security.ts
// Ce fichier gère TOUTES les données de ton dashboard (gestion d'état)
// Comme Provider en Flutter, tous les composants peuvent lire et modifier ces données

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Interfaces TypeScript (comme des classes en Flutter)
export interface Agent {
  id: number
  name: string
  status: 'active' | 'inactive' | 'en_mission'
  zone: string
  avatar: string
  phone: string
}

export interface Alert {
  id: number
  type: 'urgence' | 'vigilance' | 'info'
  message: string
  zone: string
  time: string
}

export interface Zone {
  id: number
  name: string
  level: 'secure' | 'moderate' | 'danger'
  agentsCount: number
  color: string
}

export interface Incident {
  date: string
  count: number
}

// Le Store - comme un Provider en Flutter
export const useSecurityStore = defineStore('security', () => {
  // État (State) - les données de l'app
  // ref() = comme useState en React ou StateNotifier en Flutter
  
  // Statistiques générales
  const totalAgents = ref(24)
  const activeAgents = ref(18)
  const totalAlerts = ref(7)
  const zonesMonitored = ref(12)
  const reservationsToday = ref(15)

  // Liste des agents
  const agents = ref<Agent[]>([
    {
      id: 1,
      name: 'Koné Moussa',
      status: 'active',
      zone: 'Cocody',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      phone: '+225 07 08 09 10 11'
    },
    {
      id: 2,
      name: 'Traoré Fatou',
      status: 'en_mission',
      zone: 'Plateau',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      phone: '+225 07 08 09 10 12'
    },
    {
      id: 3,
      name: 'Diallo Ibrahim',
      status: 'active',
      zone: 'Marcory',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      phone: '+225 07 08 09 10 13'
    },
    {
      id: 4,
      name: 'Bamba Aïcha',
      status: 'inactive',
      zone: 'Yopougon',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      phone: '+225 07 08 09 10 14'
    },
    {
      id: 5,
      name: 'Coulibaly Seydou',
      status: 'active',
      zone: 'Adjamé',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      phone: '+225 07 08 09 10 15'
    }
  ])

  // Alertes récentes
  const alerts = ref<Alert[]>([
    {
      id: 1,
      type: 'urgence',
      message: 'Tentative d\'effraction signalée',
      zone: 'Cocody',
      time: 'Il y a 5 min'
    },
    {
      id: 2,
      type: 'vigilance',
      message: 'Présence suspecte détectée',
      zone: 'Plateau',
      time: 'Il y a 15 min'
    },
    {
      id: 3,
      type: 'info',
      message: 'Patrouille terminée avec succès',
      zone: 'Marcory',
      time: 'Il y a 1h'
    }
  ])

  // Zones surveillées
  const zones = ref<Zone[]>([
    { id: 1, name: 'Cocody', level: 'secure', agentsCount: 4, color: '#67C23A' },
    { id: 2, name: 'Plateau', level: 'moderate', agentsCount: 3, color: '#E6A23C' },
    { id: 3, name: 'Marcory', level: 'secure', agentsCount: 3, color: '#67C23A' },
    { id: 4, name: 'Yopougon', level: 'danger', agentsCount: 2, color: '#F56C6C' },
    { id: 5, name: 'Adjamé', level: 'moderate', agentsCount: 2, color: '#E6A23C' },
    { id: 6, name: 'Abobo', level: 'secure', agentsCount: 4, color: '#67C23A' }
  ])

  // Données pour le graphique d'incidents
  const incidentsData = ref<Incident[]>([
    { date: 'Lun', count: 12 },
    { date: 'Mar', count: 8 },
    { date: 'Mer', count: 15 },
    { date: 'Jeu', count: 10 },
    { date: 'Ven', count: 18 },
    { date: 'Sam', count: 6 },
    { date: 'Dim', count: 9 }
  ])

  // Computed (valeurs calculées automatiquement)
  // Comme les getters en Flutter
  const inactiveAgents = computed(() => totalAgents.value - activeAgents.value)
  
  const urgentAlerts = computed(() => 
    alerts.value.filter(a => a.type === 'urgence').length
  )

  const secureZones = computed(() =>
    zones.value.filter(z => z.level === 'secure').length
  )

  // Actions (fonctions pour modifier l'état)
  // Comme notifyListeners() en Flutter Provider
  
  function addAlert(alert: Omit<Alert, 'id'>) {
    const newAlert: Alert = {
      ...alert,
      id: Date.now()
    }
    alerts.value.unshift(newAlert)
    totalAlerts.value++
  }

  function updateAgentStatus(agentId: number, status: Agent['status']) {
    const agent = agents.value.find(a => a.id === agentId)
    if (agent) {
      agent.status = status
      // Recalculer les agents actifs
      activeAgents.value = agents.value.filter(a => a.status === 'active' || a.status === 'en_mission').length
    }
  }

  function removeAlert(alertId: number) {
    const index = alerts.value.findIndex(a => a.id === alertId)
    if (index !== -1) {
      alerts.value.splice(index, 1)
      totalAlerts.value--
    }
  }

  // Retourner tout ce qui doit être accessible aux composants
  return {
    // État
    totalAgents,
    activeAgents,
    totalAlerts,
    zonesMonitored,
    reservationsToday,
    agents,
    alerts,
    zones,
    incidentsData,
    
    // Computed
    inactiveAgents,
    urgentAlerts,
    secureZones,
    
    // Actions
    addAlert,
    updateAgentStatus,
    removeAlert
  }
})