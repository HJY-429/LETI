import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 模式：'user' | 'developer'
  const mode = ref(localStorage.getItem('lifeIndicator_mode') || 'user')
  
  function setMode(newMode) {
    if (newMode === 'user' || newMode === 'developer') {
      mode.value = newMode
      localStorage.setItem('lifeIndicator_mode', newMode)
    }
  }
  
  function toggleMode() {
    setMode(mode.value === 'user' ? 'developer' : 'user')
  }
  
  const isDeveloper = ref(mode.value === 'developer')

  return {
    mode,
    isDeveloper,
    setMode,
    toggleMode
  }
})
