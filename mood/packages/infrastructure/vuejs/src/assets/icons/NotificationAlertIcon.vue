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
      d="M500 925a100.017 100.017 0 0 0 100.034-100H399.966A100.017 100.017 0 0 0 500 925m352.4-162.862L800 675V427c0-139.5-95.817-258.471-224.974-292.334V125a75.026 75.026 0 0 0-150.051 0v9.467C295.541 167.772 200 285.214 200 425v250l-52.4 87.138A25 25 0 0 0 169.042 800h661.916a25 25 0 0 0 21.442-37.862"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'NotificationAlertIcon',
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
