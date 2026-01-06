<template>
  <div class="login-view">
    <!-- Mobile Logo (shown only on small screens) -->
    <div class="mobile-logo">
      <img src="@/assets/logo_alph.png" alt="Alph Securite" class="logo-img" />
    </div>

    <!-- Header -->
    <div class="login-header">
      <h1>Connexion</h1>
      <p>Entrez vos identifiants pour acceder a votre espace</p>
    </div>

    <!-- Error Alert -->
    <transition name="fade">
      <div v-if="error" class="error-alert">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ error }}</span>
        <button class="close-btn" @click="clearError">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </transition>

    <!-- Form -->
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      class="login-form"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="Email ou telephone" prop="login">
        <el-input
          v-model="form.login"
          placeholder="adminalpha@security.com ou 0748754918"
          size="large"
          class="custom-input"
        >
          <template #prefix>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="Mot de passe" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Entrez votre mot de passe"
          show-password
          size="large"
          class="custom-input"
        >
          <template #prefix>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </template>
        </el-input>
      </el-form-item>

      <div class="login-options">
        <el-checkbox v-model="rememberMe" class="custom-checkbox">
          Se souvenir de moi
        </el-checkbox>
        <a href="#" class="forgot-link">Mot de passe oublie ?</a>
      </div>

      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        size="large"
        class="submit-btn"
      >
        <span v-if="!loading">Se connecter</span>
        <span v-else>Connexion en cours...</span>
      </el-button>
    </el-form>

    <!-- Footer -->
    <div class="login-footer">
      <p>Plateforme securisee Alph Securite</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const error = ref<string | null>(null)
const rememberMe = ref(false)

const form = reactive({
  login: '',
  password: '',
})

const rules: FormRules = {
  login: [
    { required: true, message: 'L\'email ou le telephone est requis', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Le mot de passe est requis', trigger: 'blur' },
    { min: 6, message: 'Minimum 6 caracteres', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    error.value = null

    try {
      await authStore.login({
        login: form.login,
        password: form.password,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } }
      error.value = axiosError.response?.data?.message || 'Email ou mot de passe incorrect'
    } finally {
      loading.value = false
    }
  })
}

function clearError() {
  error.value = null
}
</script>

<style scoped>
.login-view {
  width: 100%;
}

/* Mobile Logo */
.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.mobile-logo .logo-img {
  height: 56px;
  width: auto;
}

@media (min-width: 1024px) {
  .mobile-logo {
    display: none;
  }
}

/* Header */
.login-header {
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.login-header p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* Error Alert */
.error-alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-bottom: 24px;
}

.error-alert svg {
  width: 20px;
  height: 20px;
  color: #dc2626;
  flex-shrink: 0;
}

.error-alert span {
  flex: 1;
  font-size: 14px;
  color: #dc2626;
}

.error-alert .close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.error-alert .close-btn:hover {
  background-color: rgba(220, 38, 38, 0.1);
}

.error-alert .close-btn svg {
  width: 16px;
  height: 16px;
}

/* Form */
.login-form {
  margin-bottom: 24px;
}

.login-form :deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  padding-bottom: 8px;
}

.custom-input :deep(.el-input__wrapper) {
  padding: 4px 16px;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #e5e7eb;
  transition: all 0.2s;
}

.custom-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(45, 138, 78, 0.3);
}

.custom-input :deep(.el-input__inner) {
  height: 44px;
  font-size: 15px;
}

.input-icon {
  width: 20px;
  height: 20px;
  color: #94a3b8;
}

/* Options Row */
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
}

.custom-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #475569;
}

.custom-checkbox :deep(.el-checkbox__inner) {
  border-radius: 4px;
}

.forgot-link {
  font-size: 14px;
  color: #2d8a4e;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #236b3d;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  height: 48px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #2d8a4e, #236b3d);
  border: none;
  transition: all 0.3s;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #236b3d, #1a5530);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 138, 78, 0.35);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Footer */
.login-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.login-footer p {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
