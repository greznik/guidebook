import { defineStore } from 'pinia'

export const useSeedsStore = defineStore('seeds', {
  getters: {},
  actions: {
    async createSeed(name: string, chapterId: string) {
      try {
        return (await useApiFetch()(`/seeds/create?chapter_id=${chapterId}`, {
          method: 'POST',
          body: {
            name,
          },
        })) as any
      } catch (e) {
        return false
      }
    },

    async deleteSeed(seedId: string, chapterId: string) {
      try {
        const result = (await useApiFetch()(`/seeds/delete?id=${seedId}&chapter_id=${chapterId}`, {
          method: 'DELETE',
        })) as any

        if (result.body) {
          return result.body
        }
      } catch (e) {
        return false
      }
    },

    async updateSeed(data: string, id: string, param: string) {
      try {
        const result = (await useApiFetch()(`/seeds/update`, {
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
      } catch (e) {
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSeedsStore, import.meta.hot))
}
