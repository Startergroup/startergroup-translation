<template>
  <div
    v-if="!isClose"
    class="quizlet"
    :style="getComputedStyle"
  >
    <div class="quizlet__layout">
      <div
        v-if="!hasQuizStarted && !quizlet.is_passed"
        class="quizlet__wrapper"
      >
        <Introduction
          :title="quizlet.introductionText"
          :logo="quizlet.logo"
          @startGame="startGame"
        >
          <template #form="{ startQuizlet }">
            <slot
              name="introductionForm"
              :start-quizlet="startQuizlet"
            />
          </template>
        </Introduction>
      </div>

      <div
        v-else-if="currentQuestion && !quizlet.is_passed"
        class="quizlet__wrapper"
      >
        <header class="quizlet__header">
          <img
            v-if="quizlet.logo"
            :src="`https://streamus.online/uploads/${getLogoURL}`"
            alt="Logo"
            class="logo"
          >

          <Timer
            :duration="quizlet.duration"
            @getSpentTime="setSpentTime($event)"
            @timeOver="timeOver"
          />
        </header>

        <Question
          :content="currentQuestion.content"
          :img="currentQuestion.img"
        />

        <div class="answers">
          <Answer
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            :answer="answer"
            @onClick="selectAnswer($event)"
          />
        </div>

        <ProgressBar
          :currentNumberQuestion="count"
          :totalNumberQuestions="getQuestions.length"
        />
      </div>

      <span
        v-else-if="!quizlet.is_active"
        class="text-lg font-semibold text-gray-600 text-center"
      >
        Квиз еще не начался
      </span>

      <div
        v-else
        class="flex mb-auto"
      >
        <Rating
          :logo-url="quizlet.logoURL"
          :quiz-id="quizlet.quiz_id"
          :user-id="user.code_id"
        />
      </div>

      <IconBase
        class="absolute right-3 top-3 cursor-pointer"
        name="x-circle-icon"
        fill="#323232"
        @click="setSelectedQuizId(null)"
      />
    </div>
  </div>
</template>

<script>
import Answer from './Answer.vue'
import IconBase from '@/components/Icons/IconBase'
import Introduction from './Introduction.vue'
import Question from './Question.vue'
import ProgressBar from './ProgressBar.vue'
import Timer from './Timer.vue'
import Rating from './Rating'

import { mapState, mapMutations } from 'vuex'

export default {
  name: 'Quizlet',
  props: {
    quizlet: {
      type: Object,
      required: true
    }
  },
  components: {
    Answer,
    IconBase,
    Introduction,
    Question,
    ProgressBar,
    Timer,
    Rating
  },
  data () {
    return {
      count: 0,
      hasQuizStarted: false,
      isClose: false,
      results: {
        quiz_id: this.quizlet.quiz_id,
        time: null,
        answers: []
      }
    }
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    getQuestions () {
      return this.quizlet.questions
    },
    currentQuestion () {
      return this.getQuestions[this.count]
    },
    getComputedStyle () {
      if (!this.quizlet) return {}

      return {
        background: `${this.quizlet.bgColor}`
      }
    },
    getLogoURL () {
      if (!this.quizlet.logo) return ''

      const array = this.quizlet.logo.split('/')
      return array[array.length - 1]
    }
  },
  methods: {
    ...mapMutations('quiz', [
      'setSelectedQuizId'
    ]),
    async selectAnswer (answer) {
      this.updateAnswers(answer)
      this.count++

      if (this.count === this.getQuestions.length) {
        await this.$nextTick()
        this.$emit('finishQuizlet', { ...this.results })
      }
    },
    setSpentTime (time) {
      this.results.time = time
    },
    startGame () {
      this.hasQuizStarted = true
    },
    timeOver () {
      this.results.answers = []
      this.$emit('finishQuizlet', { results: this.results })
    },
    updateAnswers (answer) {
      this.results.answers.push(answer)
    }
  }
}
</script>
