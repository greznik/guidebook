import { defineStore } from 'pinia'
import type { IRequest } from '~/types/app.types'

export interface IAnswerUpload {
  url: string
}

export const useUploadStore = defineStore('upload', {
  getters: {},
  actions: {
    async uploadFile(file: File, tabId: string) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sheet_id', tabId)
      try {
        const result: IRequest<IAnswerUpload> = await useApiFetch()(`/upload`, {
          method: 'POST',
          body: formData,
        })
        return result
      } catch (e: any) {
        useNuxtApp().$toast.error(e.response._data.message)
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
