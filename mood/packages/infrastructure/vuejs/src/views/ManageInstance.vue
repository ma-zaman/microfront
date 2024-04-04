<template>
  <div class="d-flex flex-column h-screen w-100">
    <InstanceManager />
  </div>
</template>

<script lang="ts">
import InstanceManager from '@/components/InstanceManager.vue'
export default {
  name: 'ManageInstance',
  components: {
    InstanceManager
  }
}
</script>
