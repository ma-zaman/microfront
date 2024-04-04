<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="currentColor"
    class="solaris-icon si-pencil"
    viewBox="0 0 1000 1000"
  >
    <path
      d="M656.7 422.409a229.96 229.96 0 0 1-315.39.008A224.95 224.95 0 0 0 224.064 615H224v210a100 100 0 0 0 100 100h450V620a224.94 224.94 0 0 0-117.3-197.591M679 255A180 180 0 1 1 499 75a180 180 0 0 1 180 180"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'UserIcon',
  props: {
    width: {
      type: String,
      default: '1.15em'
    },
    height: {
      type: String,
      default: '1.15em'
    }
  }
}
</script>
