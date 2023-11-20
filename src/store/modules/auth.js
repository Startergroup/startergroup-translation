import Api from '@/api/api'
import { apiVersion } from '../../api/api.config'
import router from '../../router'

export default {
  namespaced: true,
  state: {
    timer: null,
    user: {}
  },
  getters: {
    isLogged (state) {
      const {
        access_token: accessToken = null,
        refresh_token: refreshToken = null,
        expires = null
      } = state.user

      return Boolean(accessToken && refreshToken && expires)
    }
  },
  mutations: {
    setActivity (state, lastActivity) {
      state.user.lastActivity = lastActivity
    },
    setCode (state, code) {
      state.user.code = code
    },
    saveState (state) {
      localStorage.setItem('streamusUserData', JSON.stringify(state.user))
    },
    setTimer (state, timer) {
      state.timer = timer
    },
    setTokens (state, { access_token: accessToken, refresh_token: refreshToken, expires }) {
      state.user.access_token = accessToken
      state.user.refresh_token = refreshToken
      state.user.expires = expires
    },
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    async onAuth ({ commit }, { code, name, email }) {
      const response = await Api.post(`${apiVersion}/user/login`, {
        data: {
          code,
          name,
          email,
          last_activity: null
        }
      })

      if (response?.success) {
        commit('setUser', response.data)
        commit('saveState')

        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: response?.message
        }
      }
    },
    async checkTokens ({ commit, state }) {
      if (!Object.keys(state.user).length) {
        commit('setTokens', {
          accessToken: null,
          refreshToken: null,
          expires: null
        })

        await router.push('/auth')
      }

      const { refresh_token: refreshToken, expires } = state.user

      if (expires - Date.now() < 0) {
        const tokens = await Api.post(`${apiVersion}/user/refresh_token`, {
          data: {
            code: state.user.code,
            refresh_token: refreshToken
          }
        })
          .then(res => res.data)
          .catch(error => {
            commit('setTokens', {
              accessToken: null,
              refreshToken: null,
              expires: null
            })
            router.push('/auth')
            throw Error(error)
          })

        commit('auth/setTokens', tokens)
      }
    },
    async updateActivity ({ state, commit }) {
      await Api.put(`${apiVersion}/user/update_activity`, {
        data: {
          code: state.user.code
        }
      })
    },
    async logout ({ state, commit }) {
      await Api.get(`${apiVersion}/user/auth/logout`, { code: state.code })

      commit('setTokens', { accessToken: null, refreshToken: null, expires: null })
      commit('setCode', null)
      commit('setActivity', null)
      commit('saveState')
    }
  }
}
