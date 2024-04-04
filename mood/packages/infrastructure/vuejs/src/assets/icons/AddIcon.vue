<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="currentColor"
    class="solaris-icon si-add"
    viewBox="0 0 1000 1000"
  >
    <path
      d="M850 400H600V150a50 50 0 0 0-50-50H450a50 50 0 0 0-50 50v250H150a50 50 0 0 0-50 50v100a50 50 0 0 0 50 50h250v250a50 50 0 0 0 50 50h100a50 50 0 0 0 50-50V600h250a50 50 0 0 0 50-50V450a50 50 0 0 0-50-50"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'AddIcon',
  props: {
    width: {
      type: String,
      default: '25'
    },
    height: {
      type: String,
      default: '25'
    }
  }
}
</script>
