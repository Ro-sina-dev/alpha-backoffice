<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import frFR from 'element-plus/es/locale/lang/fr'

const locale = frFR
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  font-family:
    'Poppins',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Element Plus overrides */
.el-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.el-button {
  border-radius: 8px;
}

.el-input__wrapper,
.el-select__wrapper {
  border-radius: 8px;
}

.el-table {
  font-size: 14px;
}

.el-tag {
  border-radius: 6px;
}

.el-dialog {
  border-radius: 16px;
}
</style>
