<template>
  <div class="d-flex flex-column h-screen w-100">
    <p v-if="error !== ''">Error : {{ error }}</p>
    <p>Authentication...</p>
  </div>
</template>

<script lang="ts">
import { Oauth2Authenticate } from '@/plugins/oauth2'

import { OAUTH2 } from '@/DependencyInjection'
import { inject } from 'vue'
export default {
  name: 'AuthCallback',
  setup() {
    const oauthController = inject(OAUTH2) as Oauth2Authenticate
    let error = ''
    try {
      oauthController.login()
    } catch (err) {
      error = err as string
    }
    return { error }
  }
}
</script>
