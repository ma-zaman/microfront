<template>
  <input
    :id="id"
    :data-testid="id"
    :disabled="disabled"
    :placeholder="$t(placeholder ?? ' ')"
    v-model="internalValue"
    type="text"
    :class="borderError"
    :maxlength="maxLength"
    @input="emitValue"
    required
  />
</template>

<script lang="ts">
import type { PropType } from 'vue'

export default {
  props: {
    id: {
      type: String as PropType<string>,
      required: true
    },
    maxLength: {
      type: String as PropType<string>
    },
    lowercase: {
      type: Boolean
    },
    fieldValue: {
      type: String as PropType<string>
    },
    labelValue: {
      type: String as PropType<string>
    },
    borderError: {
      type: String as PropType<string>
    },
    disabled: {
      type: Boolean
    },
    placeholder: {
      type: String as PropType<string>
    }
  },
  data: () => ({
    internalValue: ''
  }),
  mounted() {
    if (this.fieldValue) this.internalValue = this.fieldValue
  },
  watch: {
    fieldValue(newValue) {
      this.internalValue = newValue
    }
  },

  emits: ['updateValue'],
  methods: {
    emitValue() {
      if (this.lowercase) this.internalValue = this.internalValue.toLowerCase()
      this.$emit('updateValue', this.internalValue)
    }
  }
}
</script>
