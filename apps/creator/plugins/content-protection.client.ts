export default defineNuxtPlugin(() => {
  // Prevent right-click on images and videos
  window.addEventListener(
    'contextmenu',
    (e) => {
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO')) {
        e.preventDefault()
      }
    },
    true,
  )
})
