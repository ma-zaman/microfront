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
      d="M300 925H100a25 25 0 0 1-25-25V725a25 25 0 0 1 25-25h200a25 25 0 0 1 25 25v175a25 25 0 0 1-25 25m300 0H400a25 25 0 0 1-25-25V725a25 25 0 0 1 25-25h200a25 25 0 0 1 25 25v175a25 25 0 0 1-25 25m0-625H400a25 25 0 0 1-25-25V100a25 25 0 0 1 25-25h200a25 25 0 0 1 25 25v175a25 25 0 0 1-25 25m300 625H700a25 25 0 0 1-25-25V725a25 25 0 0 1 25-25h200a25 25 0 0 1 25 25v175a25 25 0 0 1-25 25M775 475H525V325h-50v150H225a50 50 0 0 0-50 50v150h50V525h250v150h50V525h250v150h50V525a50 50 0 0 0-50-50"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'HierarchyIcon',
  props: {
    width: {
      type: String,
      default: '1.67em'
    },
    height: {
      type: String,
      default: '1.67em'
    }
  }

}
</script>
