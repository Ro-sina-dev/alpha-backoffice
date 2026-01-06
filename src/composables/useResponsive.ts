import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const isMobile = ref(false)
  const isTablet = ref(false)

  function checkScreen() {
    isMobile.value = window.innerWidth < 768
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024
  }

  onMounted(() => {
    checkScreen()
    window.addEventListener('resize', checkScreen)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreen)
  })

  return {
    isMobile,
    isTablet,
  }
}
