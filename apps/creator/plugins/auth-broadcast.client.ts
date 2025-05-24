export default defineNuxtPlugin(() => {
	if (typeof window !== 'undefined') {
		const authChannel = new BroadcastChannel('auth')
		authChannel.onmessage = (event) => {
			if (event.data?.type === 'logout' || event.data?.type === 'login') {
				window.location.reload()
			}
		}
	}
})
