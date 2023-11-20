<template>
  <form action="" class="flex-col introduction__form gap-4">
    <button
      class="introduction__button button button_primary"
      @click.prevent="handleClick"
    >
      Участвую!
    </button>
  </form>
</template>

<script>
export default {
  name: 'IntroductionForm',
  props: {
    startQuizlet: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleClick () {
      this.startQuizlet()
    }
  }
}
</script>
