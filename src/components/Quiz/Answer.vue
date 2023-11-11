<template>
  <div
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
</template>

<script>
export default {
  name: 'Answer',
  props: {
    answer: {
      type: Object,
      required: true
    },
    classes: {
      type: String,
      default: 'block button button_primary h-auto py-2 px-4 break-words'
    }
  },
  computed: {
    url () {
      if (!this.answer.img) return ''

      const array = this.answer.img.split('/')
      return array[array.length - 1]
    }
  }
}
</script>
