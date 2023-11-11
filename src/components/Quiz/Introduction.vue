<template>
  <div class="introduction">
    <img
      v-if="logo"
      :src="`https://streamus.online/uploads/${logoURL}`"
      class="introduction__logo mb-8 mr-auto"
      alt="logo"
    >

    <h2 class="introduction__title text-center">{{ title }}</h2>

    <slot
      name="form"
      :start-quizlet="handleClick"
    />

    <span class="text-sm font-medium text-gray-400 text-center mt-8">
      Нажимая "Участвовать" я соглашаюсь на передачу в случае победы контактной информации спонсорам квиза - для организации вручения приза.
    </span>
  </div>
</template>

<script>
export default {
  name: 'Introduction',
  props: {
    title: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      default: null
    }
  },
  computed: {
    logoURL () {
      if (!this.logo) return ''

      const array = this.logo.split('/')
      return array[array.length - 1]
    }
  },
  methods: {
    async handleClick (func = () => {}) {
      await func()
      this.$emit('startGame')
    }
  }
}
</script>
