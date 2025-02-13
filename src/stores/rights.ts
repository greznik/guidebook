import { defineStore } from 'pinia'
import type { IRightsData, IRightsDataUsers } from '~/types/app.types'

interface IRightsStore {
  rightsData: IRightsData
  checkedUsers: IRightsDataUsers[]
}

export const useRightsStore = defineStore('rights', {
  state: (): IRightsStore => ({
    checkedUsers: [],
    rightsData: {
      groups: [],
      guest: false,
    },
  }),
  getters: {},
  actions: {
    async getRightsData(sourceId: string) {
      try {
        const result = (await useApiFetch()(`/rights/search?source_id=${sourceId}`, {
          method: 'GET',
        })) as any
        this.rightsData = result.body
      } catch (e) {
        return false
      }
    },

    async patchRightsData(sourceId: string, usersId: string[]) {
      try {
        await useApiFetch()(`/rights/update`, {
          method: 'PATCH',
          body: {
            source_id: sourceId,
            users_id: usersId,
          },
        })
      } catch (e) {
        return false
      }
    },

    async deleteRightsData(sourceId: string, userId: string) {
      try {
        await useApiFetch()(`/rights/delete`, {
          method: 'DELETE',
          body: {
            source_id: sourceId,
            users_id: userId,
          },
        })
      } catch (e) {
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRightsStore, import.meta.hot))
}
