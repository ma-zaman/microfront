<template>
  <div class="d-flex flex-column h-screen w-100">
    <AclManager />
  </div>
</template>

<script lang="ts">
import AclManager from '@/components/AclManager.vue'
export default {
  name: 'ManageAcl',
  components: {
    AclManager
  }
}
</script>
