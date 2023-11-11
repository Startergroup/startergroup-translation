<template>
  <vue-final-modal
    v-slot="{ close }"
    v-bind="$attrs"
    classes="flex items-center justify-center"
    content-class="w-full max-w-540 max-height-9/10 overflow-y-auto"
    :lock-scroll="false"
    :esc-to-close="true"
    @before-open="overwriteParams($event)"
  >
    <div class="flex flex-col items-start justify-center w-full bg-white rounded-md py-10 px-6 relative">
      <h2 class="text-lg font-semibold text-black">
        Голосование за доклад
      </h2>

      <div
        v-if="votes?.presentations"
        class="flex flex-col gap-4 mt-6"
      >
        <div
          v-for="(item, index) in votes.presentations"
          :key="index"
          class="flex flex-row items-center gap-2"
        >
          <face-smile-icon
            :class="[
              'w-8 text-gray-400 transition-all duration-250 hover:text-primary cursor-pointer',
              { 'like-icon_active' : item.is_like }
            ]"
            @click="onVotingHandler(item.presentation_id, item.is_like)"
          />
          <span class="text-base font-medium text-black w-11/12">{{ item.name }}</span>
        </div>
      </div>

      <div
        v-else
        class="flex items-center justify-center w-full mt-6"
      >
        <p class="text-sm text-gray-500 font-semibold">Голосование пока не проводится</p>
      </div>

      <x-circle-icon
        class="w-8 absolute right-6 top-6 text-black cursor-pointer"
        @click="onCloseHandler(close)"
      />
    </div>
  </vue-final-modal>
</template>

<script>
import ModalMixin from '@/mixins/Modal.mixin'
import { FaceSmileIcon, XCircleIcon } from '@heroicons/vue/24/outline'

import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'VoteModal',
  mixins: [ModalMixin],
  components: {
    FaceSmileIcon,
    XCircleIcon
  },
  computed: {
    ...mapState([
      'selectedTabId'
    ]),
    ...mapState('auth', {
      userID: state => state.user.code_id
    }),
    ...mapState('vote', [
      'votes'
    ])
  },
  async mounted () {
    await this.onGetVotesHandler()
  },
  methods: {
    ...mapActions('vote', [
      'getVotes',
      'createVote'
    ]),
    ...mapMutations('vote', [
      'setVotes'
    ]),
    async onGetVotesHandler () {
      const votes = await this.getVotes({ tabID: this.selectedTabId, userID: this.userID })
      this.setVotes(votes)
    },
    async onCloseHandler (close) {
      await close()
      this.setVotes(null)
    },
    async onVotingHandler (presentationID, like) {
      await this.createVote({ userID: this.userID, presentationID, like: !like })
      await this.onGetVotesHandler()
    }
  }
}
</script>
