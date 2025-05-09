import { ref } from 'vue'

interface BaniConfig {
  amount: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  onSuccess: (response: any) => void
  onClose: () => void
}

export function useBani() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const initializePayment = async (config: BaniConfig) => {
    try {
      isLoading.value = true
      const bani = new window.Bani({
        amount: config.amount,
        email: config.email,
        firstName: config.firstName,
        lastName: config.lastName,
        phoneNumber: config.phoneNumber,
        onSuccess: (response: any) => {
          isLoading.value = false
          config.onSuccess(response)
        },
        onClose: () => {
          isLoading.value = false
          config.onClose()
        }
      })
      bani.initialize()
    } catch (e: any) {
      error.value = e.message
      isLoading.value = false
    }
  }

  return {
    initializePayment,
    isLoading,
    error
  }
}