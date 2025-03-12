import { defineStore } from 'pinia'
import type { ROLES } from '~/constants'
import type { IRequest } from '~/types/app.types'

export interface ICreateUserBody {
  group_id: string
  login: string
  name: string
  password: string
  role: number
}

export interface IProfileUserBody {
  id: string
  login: string
  name: string
  role: ROLES
}

export interface IUpdateUserBody {
  group_id?: string
  login?: string
  name?: string
  password?: string
  role?: number
}

export interface IPatchUpdateUserBody {
  login: string
  name: string
  password: string
}

interface IAnswerCreateUser {
  chapter_id: 'string'
  group_id: 'string'
  seed_id: 'string'
  sheet_id: 'string'
}

export interface IUserInfo {
  id: string
  login: string
  name: string
  role: ROLES
}

export interface IUsersList {
  group_id: string
  name: string
  users: IUserInfo[]
}

export const useUsersStore = defineStore('users', {
  getters: {},
  actions: {
    async getUsersList(): Promise<IUsersList[]> {
      try {
        const result: IRequest<IUsersList[]> = await useApiFetch()(`/users/listgroups`, {
          method: 'GET',
        })
        return result.body
      } catch (e) {
        return []
      }
    },
    async createUser(data: ICreateUserBody) {
      try {
        const result: IRequest<IAnswerCreateUser> = await useApiFetch()(`/users/create`, {
          method: 'POST',
          body: data,
        })
        useNuxtApp().$toast.success(result.message)
        refreshNuxtData('users')
      } catch (e) {
        // useNuxtApp().$toast.error(e.message)
        return false
      } finally {
      }
    },

    async deleteUser(userId: string) {
      try {
        await useApiFetch()(`/users/delete?id=${userId}`, {
          method: 'DELETE',
        })
        refreshNuxtData('users')
      } catch (e) {
        return false
      }
    },

    async updateUser(data: IUpdateUserBody) {
      try {
        await useApiFetch()(`/users/update`, {
          method: 'PUT',
          body: data,
        })
        refreshNuxtData('users')
      } catch (e) {
        return false
      }
    },

    async patchUpdateUser(data: IPatchUpdateUserBody) {
      try {
        await useApiFetch()(`/users/update`, {
          method: 'PATCH',
          body: data,
        })
      } catch (e) {
        return false
      }
    },

    async deleteGuestRights(sourseId: string) {
      try {
        return (await useApiFetch()(`/users/delete?id=${sourseId}`, {
          method: 'DELETE',
        })) as any
      } catch (e) {
        return false
      }
    },
    async getUserInfo() {
      try {
        const result: IRequest<IProfileUserBody> = await useApiFetch()(`/users/info`, {
          method: 'GET',
        })
        return result.body
      } catch (e) {}
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
