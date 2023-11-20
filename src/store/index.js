import { createStore } from 'vuex'
import { apiVersion } from '@/api/api.config'
import Api from '@/api/api'
import { isEqual } from 'lodash'

import auth from './modules/auth'
import quiz from './modules/quiz'
import vote from './modules/vote'

export default createStore({
  state: {
    tabs: null,
    selectedTabId: null,
    settings: null
  },
  getters: {
    currentTab (state) {
      if (!state.tabs) return null
      return state.tabs.find(item => parseInt(item.tab_id) === parseInt(state.selectedTabId))
    },
    getSortedTabs (state) {
      if (!state.tabs) return []

      const tabs = [...state.tabs]
      return tabs.sort((a, b) => a.order - b.order)
    }
  },
  mutations: {
    setTabs (state, tabs) {
      state.tabs = tabs
    },
    selectTab (state, id) {
      state.selectedTabId = id
    },
    setSettings (state, settings) {
      state.settings = settings
    }
  },
  actions: {
    async getTabs ({ state, commit }) {
      const tabs = await Api.get(`${apiVersion}/tabs`).then(res => res.data)

      if (!isEqual(tabs, state.tabs)) {
        commit('setTabs', tabs)
      }
    },
    async getSettings () {
      return await Api.get(`${apiVersion}/settings`).then(res => res.data || null)
    }
  },
  modules: {
    auth,
    quiz,
    vote
  }
})
