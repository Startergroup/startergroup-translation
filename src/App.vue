<template>
  <router-view/>
  <modals-container></modals-container>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'

export default {
  name: 'App',
  async mounted () {
    const settings = await this.getSettings()

    if (!settings) return

    this.setSettings(settings)

    const favicon = settings.favicon.split('/')
    const faviconName = favicon[favicon.length - 1]

    document.title = settings[`title_${this.$i18n.locale}`]
    document.querySelector('link[rel="icon"]').setAttribute('href', `https://streamus.online/uploads/${faviconName}`)
  },
  created () {
    const userData = localStorage.getItem('streamusUserData')

    if (userData) {
      const user = JSON.parse(userData)
      this.setUser(user)
    } else {
      this.setTokens({
        accessToken: null,
        refreshToken: null,
        expires: null
      })
    }
  },
  methods: {
    ...mapMutations([
      'setSettings'
    ]),
    ...mapMutations('auth', [
      'setTokens',
      'setUser'
    ]),
    ...mapActions([
      'getSettings'
    ])
  }
}
</script>
