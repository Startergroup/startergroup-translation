<template>
  <div class="flex flex-col items-center justify-center w-full h-full md:px-10 md:py-10 py-6 px-6">
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
      />
    </div>
  </div>

  <Menu
    @open:comments="isCommentsOpen = $event"
    @open:quiz="onOpenQuizzes($event)"
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
import Actions from '@/components/Actions'
import Comments from '@/components/Comments'
import IconBase from '@/components/Icons/IconBase'
import IntroductionForm from '@/components/Quiz/IntroductionForm'
import Quizlet from '@/components/Quiz/Quizlet'
import Quizzes from '@/components/Quizzes'
import Menu from '@/components/Menu'
import Switch from '@/components/UI/Switch'
import Video from '@/components/Video'

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
      quizzes: null,
      timerID: null
    }
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    ...mapGetters('quiz', [
      'selectedQuiz'
    ]),
    getComputedStyle () {
      if (!this.selectedQuiz) return {}

      return {
        background: this.selectedQuiz.bgColor
      }
    }
  },
  unmounted () {
    clearInterval(this.timerID)
  },
  async mounted () {
    await this.getTabs()

    this.timerID = setInterval(async () => {
      await this.getTabs()
    }, 10000)

    const selectedTab = JSON.parse(sessionStorage.getItem(sessionStorageNames.selectedTab))
    if (selectedTab) {
      this.selectTab(selectedTab)
    }
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
      'setQuizzes'
    ]),
    ...mapMutations([
      'selectTab',
      'setTabs'
    ]),
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
