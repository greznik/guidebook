import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { useStorage } from '@vueuse/core'
import type { IDecodeUser } from '~/types/app.types'
import type { CookieRef } from '#app'

interface IAuthState {
  user: IDecodeUser | null
  userToken: CookieRef<string | null | undefined>
}

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    user: null,
    userToken: useCookie('token'),
  }),
  getters: {
    getDecodeToken: (state) => {
      if (state.userToken) {
        return jwtDecode(state.userToken)
      } else {
        return {}
      }
    },
  },
  actions: {
    storeToken(token: any) {
      this.userToken = token
      const newCookie = useCookie('token')
      newCookie.value = this.userToken
      refreshCookie('token')
    },

    clearAuth() {
      this.storeToken(null)
    },

    async loginUser(login: string, password: string) {
      try {
        const response = (await useApiFetch()(`/auth/login`, {
          method: 'POST',
          body: { login, password },
        })) as any

        if (!response.Token) {
          throw new Error()
        } else {
          this.storeToken(response.Token)
          return true
        }
      } catch (error) {
        console.error('Login error:', error)
        return false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
