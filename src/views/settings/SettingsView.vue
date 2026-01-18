<template>
  <div class="settings-view">
    <div class="page-header">
      <h1 class="page-title">Parametres</h1>
      <p class="page-subtitle">Configuration de l'application</p>
    </div>

    <el-tabs v-model="activeTab" class="settings-tabs">
      <el-tab-pane label="General" name="general">
        <el-card shadow="never">
          <el-form label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Nom de l'application">
                  <el-input v-model="generalSettings.app_name" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Email de contact">
                  <el-input v-model="generalSettings.contact_email" type="email" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Telephone">
                  <el-input v-model="generalSettings.contact_phone" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Devise">
                  <el-select v-model="generalSettings.currency" style="width: 100%">
                    <el-option label="FCFA (XOF)" value="XOF" />
                    <el-option label="Euro (EUR)" value="EUR" />
                    <el-option label="Dollar (USD)" value="USD" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Description">
              <el-input v-model="generalSettings.app_description" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">Enregistrer</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="Tarification" name="pricing">
        <el-card shadow="never">
          <el-form label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Tarif horaire minimum (FCFA)">
                  <el-input-number v-model="pricingSettings.min_hour_price" :min="0" :step="500" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tarif horaire maximum (FCFA)">
                  <el-input-number v-model="pricingSettings.max_hour_price" :min="0" :step="500" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="Commission (%)">
                  <el-input-number v-model="pricingSettings.commission_percentage" :min="0" :max="100" :step="1" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Frais d'annulation (%)">
                  <el-input-number v-model="pricingSettings.cancellation_fee_percentage" :min="0" :max="100" :step="1" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button type="primary">Enregistrer</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="Notifications" name="notifications">
        <el-card shadow="never">
          <el-form label-position="top">
            <h4>Notifications email</h4>
            <el-form-item>
              <el-checkbox v-model="notificationSettings.email_new_user">
                Nouvelle inscription utilisateur
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="notificationSettings.email_new_agent">
                Nouvelle demande d'agent
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="notificationSettings.email_new_mission">
                Nouvelle mission creee
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="notificationSettings.email_critical_incident">
                Incident critique signale
              </el-checkbox>
            </el-form-item>

            <h4 style="margin-top: 24px">Notifications push</h4>
            <el-form-item>
              <el-checkbox v-model="notificationSettings.push_enabled">
                Activer les notifications push
              </el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button type="primary">Enregistrer</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="Securite" name="security">
        <el-card shadow="never">
          <h4>Changer le mot de passe</h4>
          <el-form label-position="top" style="max-width: 400px">
            <el-form-item label="Mot de passe actuel">
              <el-input type="password" show-password />
            </el-form-item>
            <el-form-item label="Nouveau mot de passe">
              <el-input type="password" show-password />
            </el-form-item>
            <el-form-item label="Confirmer le mot de passe">
              <el-input type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary">Changer le mot de passe</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const activeTab = ref('general')

const generalSettings = reactive({
  app_name: 'Alpha Securite',
  app_description: 'Plateforme de securite et vigilance communautaire',
  contact_email: 'contact@alphsecurite.ci',
  contact_phone: '+225 07 00 00 00 00',
  currency: 'XOF',
  timezone: 'Africa/Abidjan',
})

const pricingSettings = reactive({
  min_hour_price: 3000,
  max_hour_price: 15000,
  commission_percentage: 15,
  cancellation_fee_percentage: 20,
})

const notificationSettings = reactive({
  email_new_user: true,
  email_new_agent: true,
  email_new_mission: true,
  email_critical_incident: true,
  push_enabled: true,
})
</script>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.settings-tabs {
  background: transparent;
}

h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-tabs :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  .settings-tabs :deep(.el-tabs__nav) {
    flex-wrap: wrap;
  }
}
</style>
