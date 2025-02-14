import { defineStore } from 'pinia'

export const useGroupsStore = defineStore('groups', {
  getters: {},
  actions: {
    async createGroup(name: string) {
      try {
        return (await useApiFetch()(`/groups/create`, {
          method: 'POST',
          body: {
            name,
          },
        })) as any
      } catch (e) {
        return false
      }
    },

    async deleteGroup(groupId: string) {
      try {
        const result = (await useApiFetch()(`/groups/delete?id=${groupId}`, {
          method: 'DELETE',
        })) as any

        if (result.body) {
          return result.body
        }
      } catch (e) {
        return false
      }
    },

    async updateGroup(data: string, id: number, param: string) {
      try {
        const result = (await useApiFetch()(`/groups/update`, {
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
  import.meta.hot.accept(acceptHMRUpdate(useGroupsStore, import.meta.hot))
}
