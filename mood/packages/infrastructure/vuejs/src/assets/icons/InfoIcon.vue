<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="#f16e00"
    class="solaris-icon si-info"
    viewBox="0 0 1000 1000"
  >
    <path
      d="M500 75.5c-234.72 0-425 190.28-425 425s190.28 425 425 425 425-190.28 425-425-190.28-425-425-425m0 100a75 75 0 1 1-75 75 75 75 0 0 1 75-75m125 600H400v-25.737l5.287-.167c15.555-.5 27.115-4.919 34.368-13.136 2.576-2.972 6.956-13.1 6.956-47.153v-227.2c0-32.392-4.523-44.6-8.311-49.141-5.359-6.391-16.516-10.147-33.17-11.156l-5.13-.31v-26h175v313.807c0 32.415 8.457 44.618 12.24 49.142 5.34 6.389 15.68 10.142 32.625 11.152l5.135.3v25.6Z"
      style="fill-rule: evenodd"
      fill="#f16e00"
    ></path>
  </svg>
</template>

<script lang="ts">
export default {
  name: 'InfoIcon',
  props: {
    width: {
      type: String,
      default: '1em'
    },
    height: {
      type: String,
      default: '1em'
    }
  }
}
</script>
