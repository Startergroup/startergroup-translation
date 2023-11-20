<template>
  <vue-final-modal
    v-slot="{ close }"
    v-bind="$attrs"
    classes="flex items-center justify-center"
    content-class="w-full max-w-540 max-height-9/10 overflow-y-auto"
    :lock-scroll="false"
    :esc-to-close="true"
    @before-open="overwriteParams($event)"
  >
    <div class="flex flex-col items-start justify-center w-full bg-white rounded-md py-10 px-6 relative">
      <p>
        Согласие на обработку персональных данных
        В соответствии со ст. 9 Федерального закона от 27.07.2006 № 152-ФЗ «О защите персональных данных» даю согласие на обработку своих персональных данных оператору сайтов streamus.ru (http://streamus.ru/) и streams.online (http://streams.online/) ООО «Лаборатория тестирования»
        Перечень персональных данных:
        - Имя.
        - Адрес электронной почты.
        Цель обработки и хранения персональных данных:
        Обеспечение обратной связи с пользователем для решения технически проблем, возникших при использовании сайта streamus.ru, а так же для связи с пользователем  в случае его участия и победы в конкурсных активностях на сайте streams.ru, организованных спонсорами данных активностей.
      </p>

      <x-circle-icon
        class="w-8 absolute right-4 top-4 text-black cursor-pointer"
        @click="close"
      />
    </div>
  </vue-final-modal>
</template>

<script>
import ModalMixin from '@/mixins/Modal.mixin'
import { XCircleIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PersonalData',
  mixins: [ModalMixin],
  components: {
    XCircleIcon
  }
}
</script>
