import * as LucideIcons from 'lucide-vue-next'

export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(LucideIcons).forEach(([name, component]) => {
    nuxtApp.vueApp.component(name, component)
  })
})