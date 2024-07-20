import Api from '@/api/api'
import { apiVersion } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    votes: {}
  },
  mutations: {
    setVotes (state, votes) {
      state.votes = votes
    }
  },
  actions: {
    async getVotes ({ commit }, { userID, tabID }) {
      return Api.get(`${apiVersion}/user/vote`, {
        tab_id: tabID,
        user_id: userID
      }).then(res => res.data || null)
    },
    async createVote ({ commit }, { userID, presentationID, like }) {
      return Api.post(`${apiVersion}/user/vote`, {
        data: {
          user_id: userID,
          presentation_id: presentationID,
          like
        }
      })
    }
  }
}
