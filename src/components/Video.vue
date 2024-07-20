<template>
  <div
    :class="[
      'video',
      { 'video_black' : !currentTab }
    ]"
  >
    <vue-plyr
      v-if="currentTab"
      ref="plyr"
    >
      <div class="video mt-4">
        <iframe
          :src="videoURL"
          allowfullscreen
          allowtransparency
          allow="autoplay"
        ></iframe>
      </div>
    </vue-plyr>

    <span
      v-else
      class="sx:text-2xl text-base font-semibold text-white px-4 md:p-0 flex items-center justify-center absolute left-0 top-0 bottom-0 right-0"
    >
      {{ user.isGuest ? $t('message.videoHintGuestUser') : $t('message.videoHint') }}
    </span>

    <slot name="overview" />
  </div>
</template>

<script>
import VuePlyr from 'vue-plyr'
import { mapGetters, mapState } from 'vuex'
import 'vue-plyr/dist/vue-plyr.css'

export default {
  name: 'Video',
  components: {
    VuePlyr
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters([
      'currentTab'
    ]),
    videoURL () {
      console.debug(this.$refs.plyr)
      return this.currentTab.url
    }
  }
}
</script>
