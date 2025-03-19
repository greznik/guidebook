import { defineStore } from 'pinia'
import { jwtDecode, type JwtPayload } from 'jwt-decode'
import { useStorage } from '@vueuse/core'
import type { IDecodeUser } from '~/types/app.types'
import type { CookieRef } from '#app'
import { ROLES } from '~/constants'

interface IAuthState {
  userInfo: IProfileUserBody | null
  currentGroupId: string | null
  user: IDecodeUser | null
  errorCode: any
  userToken: CookieRef<string> | null
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    userInfo: null,
    currentGroupId: null,
    user: null,
    errorCode: null,
    userToken: null,
  }),
  getters: {
    getDecodeToken: (state): IDecodeUser | Record<string, never> => {
      if (state.userToken) {
        return jwtDecode(state.userToken)
      } else {
        return {}
      }
    },

    hasEditable: (state) => {
      if (state.userToken) {
        const user = jwtDecode<IDecodeUser>(state.userToken)
        return (
          user.role === ROLES.ADMINS ||
          (user.role === ROLES.MODERATORS && state.userInfo?.group_id === state.currentGroupId)
        )
      } else {
        return false
      }
    },
  },
  actions: {
    storeToken(token: any) {
      this.userToken = token
      const newCookie = useCookie('token', {
        maxAge: 60 * 60 * 24, // 1 day
        secure: true,
        httpOnly: true,
      })
      newCookie.value = this.userToken
      refreshCookie('token')
    },

    clearAuth() {
      this.storeToken(null)
    },

    setGroupId(value: string) {
      this.currentGroupId = value
    },

    setError(value: string) {
      this.errorCode = value
    },

    async loginUser(login: string, password: string) {
      try {
        const response = (await useApiFetch()(`/auth/login`, {
          method: 'POST',
          body: { login, password },
        })) as any

        this.storeToken(response.Token)
        return true
      } catch (error: any) {
        useNuxtApp().$toast.error(error.response._data.message)
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
