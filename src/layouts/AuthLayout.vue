<template>
  <div class="auth-layout">
    <!-- Left Panel - Branding -->
    <div class="auth-branding">
      <div class="branding-content">
        <div class="brand-logo">
          <img src="@/assets/logo_alph.png" alt="Alph Securite" class="logo-img" />
        </div>

        <div class="branding-hero">
          <h1>Bienvenue sur votre espace d'administration</h1>
          <p>Gerez vos agents, missions, communautes et incidents depuis une interface centralisee et intuitive.</p>
        </div>

        <div class="branding-features">
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="feature-text">
              <strong>Gestion des agents</strong>
              <span>Approuvez et suivez vos agents</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <div class="feature-text">
              <strong>Suivi des missions</strong>
              <span>Supervisez en temps reel</span>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="feature-text">
              <strong>Gestion des incidents</strong>
              <span>Reagissez rapidement</span>
            </div>
          </div>
        </div>
      </div>

      <div class="branding-footer">
        <p>&copy; 2024 Alph Securite. Tous droits reserves.</p>
      </div>
    </div>

    <!-- Right Panel - Form -->
    <div class="auth-form-panel">
      <div class="form-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth layout component
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Left Branding Panel */
.auth-branding {
  flex: 1;
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px;
  background: linear-gradient(135deg, #0a1f14 0%, #134e2a 50%, #0a1f14 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.auth-branding::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(45, 138, 78, 0.25) 0%, transparent 70%);
  pointer-events: none;
}

.auth-branding::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -30%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.branding-content {
  position: relative;
  z-index: 1;
}

.brand-logo {
  margin-bottom: 60px;
}

.logo-img {
  height: 64px;
  width: auto;
  filter: brightness(0) invert(1);
}

.branding-hero h1 {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px 0;
  letter-spacing: -0.5px;
}

.branding-hero p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 48px 0;
  max-width: 400px;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature-icon {
  width: 44px;
  height: 44px;
  background: rgba(45, 138, 78, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 22px;
  height: 22px;
  color: #4ade80;
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-text strong {
  font-size: 15px;
  font-weight: 600;
}

.feature-text span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.branding-footer {
  position: relative;
  z-index: 1;
}

.branding-footer p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Right Form Panel */
.auth-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background-color: #ffffff;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

@media (min-width: 1024px) {
  .auth-branding {
    display: flex;
  }

  .auth-form-panel {
    flex: 0 0 520px;
  }
}

@media (min-width: 1280px) {
  .auth-form-panel {
    flex: 0 0 560px;
  }

  .branding-hero h1 {
    font-size: 42px;
  }
}
</style>
