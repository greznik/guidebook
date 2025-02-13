import { defineStore } from 'pinia'

export const useChaptersStore = defineStore('chapters', {
  getters: {},
  actions: {
    async createChapter(name: string, groupId: number, guest_access: boolean) {
      try {
        return (await useApiFetch()(`/chapters/create?group_id=${groupId}`, {
          method: 'POST',
          body: {
            guest_access,
            name,
          },
        })) as any
      } catch (e) {
        return false
      }
    },

    async deleteChapter(chapterId: string, groupId: string) {
      try {
        const result = (await useApiFetch()(`/chapters/delete?id=${chapterId}&group_id=${groupId}`, {
          method: 'DELETE',
        })) as any

        if (result.body) {
          return result.body
        }
      } catch (e) {
        return false
      }
    },

    async updateChapter(data: string, id: string, param: string) {
      try {
        const result = (await useApiFetch()(`/chapters/update`, {
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
  import.meta.hot.accept(acceptHMRUpdate(useChaptersStore, import.meta.hot))
}
