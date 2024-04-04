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
      d="M700 925H300a50 50 0 0 1-50-50V125a50 50 0 0 1 50-50h400a50 50 0 0 1 50 50v750a50 50 0 0 1-50 50m0-775a25 25 0 0 0-25-25H325a25 25 0 0 0-25 25v50a25 25 0 0 0 25 25h350a25 25 0 0 0 25-25zm0 150a25 25 0 0 0-25-25H325a25 25 0 0 0-25 25v50a25 25 0 0 0 25 25h350a25 25 0 0 0 25-25zm0 150a25 25 0 0 0-25-25H325a25 25 0 0 0-25 25v50a25 25 0 0 0 25 25h350a25 25 0 0 0 25-25zm-350 50a25 25 0 1 1 25-25 25 25 0 0 1-25 25m0-150a25 25 0 1 1 25-25 25 25 0 0 1-25 25m0-150a25 25 0 1 1 25-25 25 25 0 0 1-25 25m150 600a25 25 0 1 1-25 25 25 25 0 0 1 25-25"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'ServerTowerIcon',
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
