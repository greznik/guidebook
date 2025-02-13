import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload', {
  getters: {},
  actions: {
    async uploadFile(file: File, tabId: string) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sheet_id', tabId)
      try {
        return await useApiFetch()(`/upload`, {
          method: 'POST',
          body: formData,
        })
      } catch (e) {
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
