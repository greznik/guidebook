import { storeToRefs } from 'pinia'

const user = useAuthStore()
export default defineNuxtRouteMiddleware(() => {
	const { userToken } = storeToRefs(user)
	if (!userToken.value) {
		return navigateTo('/')
	}
})
