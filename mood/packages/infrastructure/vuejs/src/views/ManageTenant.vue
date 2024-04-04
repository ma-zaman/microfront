<template>
  <div class="d-flex flex-column h-screen w-100">
    <TenantManager />
  </div>
</template>

<script lang="ts">
import TenantManager from '@/components/TenantManager.vue'

export default {
  name: 'ManageTenant',
  components: {
    TenantManager
  }
}
</script>
