import { defineStore } from 'pinia'

export const useGuestStore = defineStore('guest', {
  getters: {},
  actions: {
    async fetchGuestRights(sourseId: string) {
      try {
        return (await useApiFetch()(`/guest/create`, {
          method: 'POST',
          body: {
            source_id: sourseId,
          },
        })) as any
      } catch (e) {
        return false
      }
    },

    async deleteGuestRights(sourseId: string) {
      try {
        return (await useApiFetch()(`/guest/delete?id=${sourseId}`, {
          method: 'DELETE',
        })) as any
      } catch (e) {
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGuestStore, import.meta.hot))
}
