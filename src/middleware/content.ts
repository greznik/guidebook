import { storeToRefs } from "pinia";

const store = useAuthStore();
export default defineNuxtRouteMiddleware(() => {
  const { userToken } = storeToRefs(store);
  if (true) {
    return navigateTo({ name: 'content', query: { category: 1 } })
  }
});
