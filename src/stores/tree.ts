import { defineStore } from 'pinia'
import { useApiFetch } from './api'

export const useTreeStore = defineStore('tree', {
  state: () => ({
    tree: [] as any,
    treeGroups: [] as any,
    loading: false,
    chapterId: '',
    content: {} as any,
    searchData: [],
  }),

  getters: {
    getSidebarItems(state) {
      return (chapterId: string) => {
        return state.tree.find((item: any) => {
          return item.chapters.find((chapter: any) => {
            return chapter.id === chapterId
          })
        })
      }
    },
  },

  actions: {
    setChapterId(id: string) {
      this.chapterId = id
    },

    async getItemsTree() {
      const { clearAuth } = useAuthStore()
      try {
        this.loading = true
        const response = (await useApiFetch()(`/structure/tree`, {
          method: 'GET',
        })) as any

        this.tree = response.body.groups
        return true
      } catch (e) {
        clearAuth()
        return false
      } finally {
        this.loading = false
      }
    },

    async getContent(id: string) {
      try {
        this.loading = true

        if (id) {
          const { body } = (await useApiFetch()(`/sheets/take?id=${id}`, {
            method: 'GET',
          })) as any

          if (body) {
            this.content = body
          }
        } else {
          this.content = {}
        }
        return true
      } catch (error: any) {
        throw createError({
          statusCode: error.response.status,
          statusMessage: error.response._data.message
        })
      } finally {
        this.loading = false
      }
    },

    async searchContent(key: string) {
      try {
        this.loading = true

        const result = (await useApiFetch()(`/structure/search?key=${key}`, {
          method: 'GET',
        })) as any

        if (result.body) {
          return result.body
        }
      } catch (e) {
        return false
      } finally {
        this.loading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTreeStore, import.meta.hot))
}
