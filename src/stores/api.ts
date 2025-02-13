export const useApiFetch = () => {
  const config = useRuntimeConfig()
  return $fetch.create({
    baseURL: config.public.baseUrl,
    headers: {
      Authorization: useAuthStore().userToken ? `Bearer ${useAuthStore().userToken}` : '',
    },
  })
}
