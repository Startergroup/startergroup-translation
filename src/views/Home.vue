<template>
  <div class="flex flex-col items-center justify-center w-full min-h-screen md:px-10 md:py-10 py-6 px-6">
    <div
      class="flex flex-col xl:flex-row items-start w-full gap-4"
      :style="{
        maxWidth: isOpenSchedule ? '1475px' : '1175px'
      }"
    >
      <div class="overview">
        <Switch
          class="ml-auto"
          :classes="[{ 'switch_dark' : isCinemaMode }]"
          @update:switch-state="isCinemaMode = $event"
        >
          <template #icon>
            <IconBase
              name="light"
              width="16"
              height="16"
              stroke-color="#fff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              :view-box-size="[16, 16]"
            />
          </template>
        </Switch>

        <Video class="2xl:mt-4 mt-12">
          <template #overview>
            <Quizlet
              v-if="selectedQuiz"
              :quizlet="selectedQuiz"
              :is-finished="false"
              @finish-quizlet="finishQuiz($event)"
            >
              <template #introductionForm="{ startQuizlet }">
                <IntroductionForm
                  :start-quizlet="startQuizlet"
                  :username="user.username"
                />
              </template>
            </Quizlet>
          </template>
        </Video>

        <Actions
          class="mt-4"
          @open:comments="isCommentsOpen = $event"
          @open:quiz="onOpenQuizzes($event)"
          @open:schedule="isOpenSchedule = !isOpenSchedule"
        />
      </div>

      <iframe
        v-if="currentTab && currentTab.schedule && isOpenSchedule"
        :src="`${currentTab.schedule}?code=${user.code}`"
        class="flex self-stretch h-72 xl:h-auto"
      ></iframe>
    </div>
  </div>

  <Menu
    @open:comments="isCommentsOpen = $event"
    @open:quiz="isQuizOpen = $event"
  />

  <Comments
    :is-open="isCommentsOpen"
    @update:comments="isCommentsOpen = $event"
  />

  <Quizzes
    :is-open="isQuizOpen"
    @update:quiz="isQuizOpen = $event"
  />

  <div
    :class="[
      'cinema-mode',
      { 'cinema-mode_active' : isCinemaMode }
    ]"
  ></div>
</template>

<script>
import Actions from '@/components/Actions.vue'
import Comments from '@/components/Comments.vue'
import IconBase from '@/components/Icons/IconBase.vue'
import IntroductionForm from '@/components/Quiz/IntroductionForm.vue'
import Quizlet from '@/components/Quiz/Quizlet.vue'
import Quizzes from '@/components/Quizzes.vue'
import Menu from '@/components/Menu.vue'
import Switch from '@/components/UI/Switch.vue'
import Video from '@/components/Video.vue'

import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import { sessionStorageNames } from '@/constants/sessionStorage'

export default {
  name: 'Home',
  components: {
    Actions,
    Comments,
    IconBase,
    IntroductionForm,
    Quizlet,
    Quizzes,
    Menu,
    Switch,
    Video
  },
  data () {
    return {
      isCinemaMode: false,
      isCommentsOpen: false,
      isQuizOpen: false,
      isOpenSchedule: false,
      quizzes: null,
      timerID: null
    }
  },
  computed: {
    ...mapState([
      'selectedTabId'
    ]),
    ...mapGetters([
      'currentTab'
    ]),
    ...mapState('auth', [
      'user'
    ]),
    ...mapGetters('quiz', [
      'selectedQuiz'
    ])
  },
  unmounted () {
    clearInterval(this.timerID)
  },
  async mounted () {
    if (!this.user.isGuest) {
      await this.getTabs()

      this.timerID = setInterval(async () => {
        await this.getTabs()
      }, 10000)

      const selectedTab = JSON.parse(sessionStorage.getItem(sessionStorageNames.selectedTab))

      if (selectedTab) {
        this.selectTab(selectedTab)
      }

      const votes = await this.getVotes({ tabID: this.selectedTabId, userID: this.user?.code_id })
      this.setVotes(votes)
    }

    const quizzes = await this.getQuizzes(this.user?.code_id)
    this.setQuizzes(quizzes)

    if (quizzes.length) {
      this.setSelectedQuizId(quizzes[0]?.quiz_id)
    }

    this.isOpen = true
  },
  methods: {
    ...mapActions('quiz', [
      'getQuizzes',
      'sendQuiz'
    ]),
    ...mapActions([
      'getTabs'
    ]),
    ...mapMutations('quiz', [
      'setQuizzes',
      'setSelectedQuizId'
    ]),
    ...mapMutations([
      'selectTab',
      'setTabs'
    ]),
    ...mapMutations('vote', ['setVotes']),
    ...mapActions('vote', ['getVotes']),
    async finishQuiz (result) {
      const payload = {
        ...result,
        user_id: this.user.code_id
      }
      const response = await this.sendQuiz(payload)

      if (!response.success) {
        console.error(response.message)
      }
    },
    async onOpenQuizzes (state) {
      const quizzes = await this.getQuizzes(this.user.code_id)

      this.setQuizzes(quizzes)
      this.isQuizOpen = state
    }
  }
}
</script>
