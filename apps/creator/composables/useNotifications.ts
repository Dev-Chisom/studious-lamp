import { ref } from 'vue';
import { toast } from 'vue3-toastify';

interface Notification {
	id: string
	type: 'success' | 'error' | 'info' | 'warning'
	message: string
	duration?: number
}

export function useNotification() {
	const notifications = ref<Notification[]>([]);

	const show = (notification: Omit<Notification, 'id'>) => {
		const id = Math.random().toString(36).substring(2, 9);
		const newNotification = {
			id,
			...notification,
			duration: notification.duration || 3000,
		};

		notifications.value.push(newNotification);

		toast[notification.type](notification.message, {
			autoClose: notification.duration,
			position: toast.POSITION.TOP_RIGHT,
		});

		setTimeout(() => {
			remove(id);
		}, newNotification.duration);
	};

	const remove = (id: string) => {
		notifications.value = notifications.value.filter((n) => n.id !== id);
	};

	const success = (message: string, duration?: number) => {
		show({ type: 'success', message, duration });
	};

	const error = (message: string, duration?: number) => {
		show({ type: 'error', message, duration });
	};

	const info = (message: string, duration?: number) => {
		show({ type: 'info', message, duration });
	};

	const warning = (message: string, duration?: number) => {
		show({ type: 'warning', message, duration });
	};

	return {
		notifications,
		show,
		remove,
		success,
		error,
		info,
		warning,
	};
}
