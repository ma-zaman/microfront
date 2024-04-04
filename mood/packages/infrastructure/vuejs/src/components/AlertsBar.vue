<template>
  <div
    v-if="visible"
    class="position-absolute top-0 start-50 translate-middle-x mt-5"
    style="z-index: 10000; min-width: 33%"
  >
    <div :class="`alert alert-${type} py-8 px-10 w-100`" style="background: white" role="alert">
      <div class="row w-100">
        <div class="col-2">
          <span class="alert-icon"
            ><span class="visually-hidden">{{ icon }}</span></span
          >
        </div>
        <div class="col-8">
          <div class="row">
            <h4 class="alert-heading">
              {{ $t(title) }}
            </h4>
          </div>
          <div class="row">
            <p>{{ body }}</p>
          </div>

          <div v-if="response" class="row">
            <p>{{ response }}</p>
          </div>
        </div>

        <div v-if="showCloseBtn" class="col-2">
          <button type="button" class="btn-close" @click="alert.hideAlert">
            <span class="visually-hidden">Close</span>
          </button>
        </div>
        <div v-else class="col-2">
          <span id="spinner" class="spinner-border text-info"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { alertStore } from '@/stores/alerts'
import { computed } from 'vue'

export default {
  setup() {
    const alert = alertStore()

    const visible = computed(() => alert.getVisible)
    const type = computed(() => alert.getType)
    const icon = computed(() => alert.getIcon)
    const title = computed(() => alert.getTitle)
    const body = computed(() => alert.getBody)
    const response = computed(() => alert.getResponse)
    const showCloseBtn = computed(() => alert.getShowCloseBtn)

    return {
      alert,
      visible,
      type,
      icon,
      title,
      body,
      response,
      showCloseBtn
    }
  },
  name: 'AlertsBar'
}
</script>
