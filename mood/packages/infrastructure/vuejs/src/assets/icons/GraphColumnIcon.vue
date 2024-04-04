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
      d="M325 475H175a25 25 0 0 0-25 25v250a25 25 0 0 0 25 25h150a25 25 0 0 0 25-25V500a25 25 0 0 0-25-25m250-350H425a25 25 0 0 0-25 25v600a25 25 0 0 0 25 25h150a25 25 0 0 0 25-25V150a25 25 0 0 0-25-25m250 175H675a25 25 0 0 0-25 25v425a25 25 0 0 0 25 25h150a25 25 0 0 0 25-25V325a25 25 0 0 0-25-25m50 525H125a25 25 0 0 0-25 25 25 25 0 0 0 25 25h750a25 25 0 0 0 25-25 25 25 0 0 0-25-25"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'GraphColumnIcon',
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
