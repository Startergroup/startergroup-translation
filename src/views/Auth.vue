<template>
  <div class="flex flex-row h-screen w-full">
    <div class="lg:flex hidden flex-col items-center justify-end h-full w-1/2 bg-transparent px-10">
      <div class="flex flex-col items-center w-full my-auto relative top-14">
        <h2 v-html="getTitle" class="text-6xl font-bold text-black text-center mb-2"></h2>
        <p class="text-lg font-regular text-black text-center">{{ getSubtitle }}</p>
      </div>

      <img
        :src="LearningIcon"
        alt="learning"
        class=""
      >
    </div>

    <div class="flex flex-col justify-center items-center h-full lg:w-1/2 w-full px-4 lg:px-0 bg-white relative">
      <div class="flex flex-col lg:w-328 w-full max-w-328 shadow-md-y-0 px-5 py-6 bg-white rounded-2xl">
        <h2 class="text-xl font-normal text-black mb-6">{{ $t('message.authTitle') }}</h2>

        <div
          v-show="error"
          class="flex items-center justify-center w-full rounded-md bg-red-400 mb-4 py-2"
        >
          <span class="text-xs text-center font-semibold text-white uppercase">
            {{ error }}
          </span>
        </div>

        <form class="flex flex-col">
          <div class="flex flex-col w-full mb-4">
            <label class="text-sm text-black font-normal mb-1 ml-2">{{ $t('message.name') }}</label>
            <input
              v-model="name"
              type="text"
              :class="['input', { 'input_error' : error }]"
              required
              :placeholder="$t('message.name')"
              @focus="error = ''"
            >
          </div>

<!--          <div class="flex flex-col w-full mb-4">-->
<!--            <label class="text-sm text-black font-normal mb-1 ml-2">{{ $t('message.email') }}</label>-->
<!--            <input-->
<!--              v-model="email"-->
<!--              type="text"-->
<!--              :class="['input', { 'input_error' : error }]"-->
<!--              required-->
<!--              :placeholder="$t('message.email')"-->
<!--              @focus="error = ''"-->
<!--            >-->
<!--          </div>-->

          <div class="flex flex-col w-full mb-8">
            <label class="text-sm text-black font-normal mb-1 ml-2">{{ $t('message.code') }}</label>
            <div class="flex items-center gap-2 w-full">
              <input
                v-model="code"
                type="password"
                :class="['input', { 'input_error' : error }]"
                required
                :placeholder="$t('message.code')"
                @focus="error = ''"
              >

              <div class="tooltip">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11.875V11.25C10.4945 11.25 10.9778 11.1034 11.3889 10.8287C11.8 10.554 12.1205 10.1635 12.3097 9.70671C12.4989 9.24989 12.5484 8.74723 12.452 8.26228C12.3555 7.77732 12.1174 7.33187 11.7678 6.98223C11.4181 6.6326 10.9727 6.3945 10.4877 6.29804C10.0028 6.20157 9.50011 6.25108 9.04329 6.4403C8.58648 6.62952 8.19603 6.94995 7.92133 7.36108C7.64662 7.7722 7.5 8.25555 7.5 8.75" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 15C10.3452 15 10.625 14.7202 10.625 14.375C10.625 14.0298 10.3452 13.75 10 13.75C9.65482 13.75 9.375 14.0298 9.375 14.375C9.375 14.7202 9.65482 15 10 15Z" fill="#fff"/>
                </svg>

                <div class="tooltip-content">
                  {{ $t('message.codeHint') }}
                </div>
              </div>
            </div>
          </div>

         <div class="flex flex-col w-full">
           <Button
             classes="button_primary"
             :value="$t('message.enterButton')"
             @on-click="login"
           />
         </div>
        </form>
      </div>

      <Localization class="absolute right-8 top-0" />
    </div>
  </div>
</template>

<script>
import Button from '@/components/UI/Button'
import LearningIcon from '@/assets/svg/learning.svg'
import Localization from '@/components/Localization'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'Auth',
  components: {
    Button,
    Localization
  },
  data () {
    return {
      LearningIcon,
      email: null,
      name: null,
      code: null,
      error: null
    }
  },
  computed: {
    ...mapState([
      'settings'
    ]),
    getTitle () {
      if (!this.settings) return ''

      const currentLocale = this.settings[`title_${this.$i18n.locale}`]
      const str = currentLocale.replace(/[0-9]/g, '').replace(/[^a-zа-яё0-9\s]/gi, '')
      const num = parseInt(currentLocale.match(/\d+/)) || ''

      return `${str}<span class="text-primary">/</span> ${num}`
    },
    getSubtitle () {
      if (!this.settings) return ''

      return this.settings[`subtitle_${this.$i18n.locale}`]
    }
  },
  methods: {
    ...mapActions('auth', [
      'onAuth'
    ]),
    async login () {
      try {
        if (!(this.name && this.code)) {
          this.error = 'Не заполнены все обязательные поля.'
          return
        }

        const { success, message } = await this.onAuth({
          code: this.code,
          name: this.name
        })

        if (!success) {
          this.error = message
        } else {
          this.$router.push('/')
        }
      } catch (error) {
        this.error = error
      }
    }
  }
}
</script>
