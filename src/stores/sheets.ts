import { defineStore } from 'pinia'

export const useSheetsStore = defineStore('sheets', {
  getters: {},
  actions: {
    async updateSheet(data: string, id: string, param: string) {
      try {
        const result = (await useApiFetch()(`/sheets/update`, {
          method: 'PATCH',
          body: {
            data,
            id,
            param,
          },
        })) as any

        if (result.body) {
          return result.body
        }
      } catch (error: any) {
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSheetsStore, import.meta.hot))
}
