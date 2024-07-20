<template>
  <div
    v-if="!question.free_answer"
    :class="classes"
    @click="$emit('onClick', answer)"
  >
    {{ answer.content }}

    <img
      v-if="answer.img"
      :src="`https://streamus.online/uploads/${url}`"
      alt=""
      style="max-height: 150px;"
    >
  </div>

  <div
    v-else
    class="flex flex-col items-start w-full gap-3"
  >
    <span class="text-base font-medium text-black">Введите вариант ответа</span>

    <div class="flex items-center w-full gap-3">
      <input
        v-model="freeAnswer"
        type="text"
        class="w-full border border-gray-200 rounded-md w-full outline-none px-4 py-2"
      >

      <div
        class="button button_primary w-auto px-3"
        @click="onUpdateAnswer(answer, value)"
      >
        Дальше
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Answer',
  props: {
    answer: {
      type: Object,
      required: true
    },
    question: {
      type: Object,
      required: true
    },
    classes: {
      type: String,
      default: 'block button button_primary h-auto py-2 px-4 break-words'
    }
  },
  data () {
    return {
      freeAnswer: ''
    }
  },
  computed: {
    url () {
      if (!this.answer.img) return ''

      const array = this.answer.img.split('/')
      return array[array.length - 1]
    }
  },
  methods: {
    onUpdateAnswer (answer) {
      this.$emit('onClick', { ...answer, value: this.freeAnswer })
      this.freeAnswer = ''
    }
  }
}
</script>
