<template>
  <div class="d-flex flex-column h-screen w-100">
    <nav-bar />
    <router-view class="h-100 w-100" />
    <my-footer />
  </div>
  <alerts-bar />
</template>

<script lang="ts">
import NavBar from './components/NavBar.vue'
import MyFooter from './components/Footer.vue'
import AlertsBar from '@/components/AlertsBar.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    MyFooter,
    AlertsBar
  }
}
</script>
