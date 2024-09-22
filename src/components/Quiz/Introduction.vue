<template>
  <div class="introduction">
    <img
      v-if="logo"
      :src="`https://streamos.ru/uploads/${getFormattedLogoURL}`"
      class="introduction__logo mb-8 mr-auto"
      alt="logo"
    >

    <img
      v-if="introImg.length"
      :src="`https://streamos.ru/uploads/${getFormattedIntroImgUrl}`"
      class="intro-img"
    >

    <h2 class="introduction__title text-center">{{ title }}</h2>

    <slot
      name="form"
      :start-quizlet="handleClick"
    />

    <span class="text-sm font-medium text-gray-400 text-center mt-8">
      {{ agreement }}
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
    },
    agreement: {
      type: String,
      required: true
    },
    introImg: {
      type: String,
      default: null
    }
  },
  computed: {
    getFormattedLogoURL () {
      if (!this.logo) return ''

      const array = this.logo.split('/')
      return array[array.length - 1]
    },
    getFormattedIntroImgUrl () {
      if (!this.introImg) return ''

      const array = this.introImg.split('/')
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

<style scoped lang="scss">
.intro-img {
  width: 100%;
  max-height: 240px;
}
</style>
