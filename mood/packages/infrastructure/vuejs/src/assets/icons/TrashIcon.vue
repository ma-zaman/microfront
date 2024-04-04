<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    fill="currentColor"
    class="solaris-icon si-trash"
    viewBox="0 0 1000 1000"
  >
    <path
      d="M750 149.959H625V125a50 50 0 0 0-50-50H425a50 50 0 0 0-50 50v24.959H250a75 75 0 0 0-75 75V275h650v-50.041a75 75 0 0 0-75-75M425 125h150v24.959H425zM225 299.959V925h550V299.959H225ZM375 400v425a25 25 0 0 1-50 0V399.959a25 25 0 0 1 50 0zm150 0v425a25 25 0 0 1-50 0V399.959a25 25 0 0 1 50 0zm150 0v425a25 25 0 0 1-50 0V399.959a25 25 0 0 1 50 0z"
      style="fill-rule: evenodd"
    />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'TrashIcon',
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
