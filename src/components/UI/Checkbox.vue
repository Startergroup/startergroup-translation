<template>
  <label
    :class="[
      'checkbox__label',
      classes
    ]"
  >
    <input
      type="checkbox"
      class="checkbox__input"
      :checked="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
    >

    <span class="checkbox__checkmark"></span>

    <slot name="label">
      <p
        v-if="label"
        class="subtitle"
      >
        {{ label }}
      </p>
    </slot>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    classes: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>
