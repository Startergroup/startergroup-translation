<template>
  <div class="question">
    <h2 class="question__h2">{{ content }}</h2>

    <img
      v-if="img"
      :src="`https://streamos.ru/uploads/${url}`"
      alt="question-image"
      class="question__img"
    >
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    img: {
      type: String,
      default: ''
    }
  },
  computed: {
    url () {
      if (!this.img) return ''

      const array = this.img.split('/')
      return array[array.length - 1]
    }
  }
}
</script>
