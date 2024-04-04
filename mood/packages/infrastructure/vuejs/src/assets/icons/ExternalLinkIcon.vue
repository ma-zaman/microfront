<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="#ffffff"
    class="solaris-icon si-external-link"
    viewBox="0 0 1000 1000"
  >
    <path
      d="M725 756.25A43.88 43.88 0 0 1 681.25 800h-437.5A43.88 43.88 0 0 1 200 756.25v-437.5A43.88 43.88 0 0 1 243.75 275h269.118l75-75H215c-49.5 0-90 40.5-90 90v495c0 49.5 40.5 90 90 90h495c49.5 0 90-40.5 90-90V412.132l-75 75zM820.36 125H574.479l82.021 82.021-165.348 165.348a55.157 55.157 0 0 0 0 77.988l58.491 58.491a55.157 55.157 0 0 0 77.988 0L792.979 343.5 875 425.521V179.64A54.64 54.64 0 0 0 820.36 125"
      style="fill-rule: evenodd"
      fill="#ffffff"
    ></path>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'ExternalLinkIcon',
  props: {
    width: {
      type: String,
      default: '16'
    },
    height: {
      type: String,
      default: '16'
    }
  }
}
</script>
