<template>
  <div
    v-if="icons.length"
    class="flex flex-row justify-between items-center w-full rounded-2xl bg-white px-8 py-2 z-20 relative"
  >
    <p
      v-if="currentTab"
      class="text-base text-secondary-2 font-medium"
    >
      <span class="text-black font-bold">{{ currentTab.name }}</span>
    </p>

    <div class="flex flex-row items-center gap-3 ml-auto">
      <Button
        v-for="(item, index) in icons"
        :key="index"
        :classes="item.classes"
        :title="item.hint"
        @click="item.onClick"
      >
        <template #content>
          <IconBase
            :name="item.name"
            :width="item.width"
            :height="item.height"
            :stroke-color="item.strokeColor"
            :stroke-width="item.strokeWidth"
            :stroke-linecap="item.strokeLinecap"
            :stroke-linejoin="item.strokeLinejoin"
            :view-box-size="item.viewBoxSize"
            :title="item.hint"
          />
        </template>
      </Button>
    </div>
  </div>
</template>

<script>
import Button from '@/components/UI/Button.vue'
import IconBase from '@/components/Icons/IconBase.vue'
import VoteModal from '@/components/Modals/VoteModal.vue'

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Actions',
  components: {
    Button,
    IconBase
  },
  emits: ['open:quiz', 'open:schedule', 'open:comments'],
  computed: {
    ...mapState([
      'selectedTabId',
      'quiz'
    ]),
    ...mapState('auth', ['user']),
    ...mapState('quiz', ['quizzes']),
    ...mapState('vote', ['votes']),
    ...mapGetters([
      'currentTab'
    ]),
    icons () {
      return [
        {
          hide: !this.quizzes.every(item => item.is_active) || !this.quizzes.length,
          name: 'quiz',
          classes: 'button_primary rounded-full w-10',
          hint: 'Квиз',
          width: '23',
          height: '24',
          strokeColor: '#fff',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          viewBoxSize: [23, 24],
          onClick: () => {
            this.$emit('open:quiz', true)
          }
        },
        {
          hide: this.user.isGuest,
          name: 'question',
          classes: 'button_primary rounded-full w-10',
          hint: 'Задать вопрос',
          width: '23',
          height: '24',
          strokeColor: '#fff',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          viewBoxSize: [23, 24],
          title: this.$t('message.chatTitle'),
          onClick: () => {
            this.$emit('open:comments', true)
          }
        },
        {
          hide: !this.currentTab || this.user.isGuest,
          name: 'calendar',
          classes: `button_primary rounded-full w-10 ${this.currentTab ? (this.currentTab.schedule ? '' : 'button_disable') : 'button_disable'}`,
          hint: 'Расписание',
          width: 24,
          height: 24,
          viewBoxSize: [24, 24],
          title: this.$t('message.chatTitle'),
          onClick: () => {
            if (!this.selectedTabId) return
            this.$emit('open:schedule')
          }
        },
        {
          hide: !this.currentTab || this.votes.success === false || this.user.isGuest,
          name: 'survey',
          classes: `button_primary rounded-full w-10 ${!this.selectedTabId && 'button_disable'}`,
          hint: 'Голосование',
          width: '23',
          height: '24',
          strokeColor: '#fff',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          viewBoxSize: [23, 24],
          onClick: () => {
            if (!this.selectedTabId) return

            this.$vfm.show({
              component: VoteModal
            })
          }
        }
      ].filter(item => !item.hide)
    }
  }
}
</script>
