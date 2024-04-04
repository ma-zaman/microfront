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
      d="M892.285 819.383 666.631 593.728a310.8 310.8 0 0 0 58.05-181.388c0-172.5-139.839-312.34-312.341-312.34S100 239.838 100 412.34s139.838 312.341 312.34 312.341a310.9 310.9 0 0 0 181.4-58.05l225.643 225.644a25.053 25.053 0 0 0 35.342 0l37.56-37.55a25.07 25.07 0 0 0 0-35.342M412.34 624.732c-117.3 0-212.391-95.092-212.391-212.392S295.04 199.949 412.34 199.949 624.732 295.04 624.732 412.34 529.64 624.732 412.34 624.732"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'SearchIcon',
  props: {
    width: {
      type: String,
      default: '1.6em'
    },
    height: {
      type: String,
      default: '1.6em'
    }
  }
}
</script>
