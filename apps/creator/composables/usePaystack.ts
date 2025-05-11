import { ref } from 'vue'

interface PaystackConfig {
  email: string
  amount: number
  publicKey: string
  reference?: string
  callback: (response: any) => void
  onClose: () => void
}

export function usePaystack() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const initializePayment = (config: PaystackConfig) => {
    try {
      isLoading.value = true
      const handler = window.PaystackPop.setup({
        key: config.publicKey,
        email: config.email,
        amount: config.amount * 100, // Convert to kobo
        ref: config.reference || generateReference(),
        callback: (response: any) => {
          isLoading.value = false
          config.callback(response)
        },
        onClose: () => {
          isLoading.value = false
          config.onClose()
        },
      })
      handler.openIframe()
    } catch (e: any) {
      error.value = e.message
      isLoading.value = false
    }
  }

  const generateReference = () => {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 15)
    return `TXN-${timestamp}-${random}`
  }

  return {
    initializePayment,
    isLoading,
    error,
  }
}
