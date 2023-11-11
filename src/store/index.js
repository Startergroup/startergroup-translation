import { createStore } from 'vuex'
import Api from '@/api/api'
import { apiVersion } from '@/api/api.config'

import auth from './modules/auth'
import quiz from './modules/quiz'
import vote from './modules/vote'

export default createStore({
  state: {
    tabs: null,
    selectedTabId: null,
    settings: null
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
  getters: {
    currentTab (state) {
      if (!state.tabs) return null
      return state.tabs.find(item => parseInt(item.tab_id) === parseInt(state.selectedTabId))
    }
  },
  actions: {
    async getTabs () {
      return await Api.get(`${apiVersion}/tabs`).then(res => res.data)
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
