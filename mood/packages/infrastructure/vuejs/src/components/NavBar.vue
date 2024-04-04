<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid flex flex-col">
      <div class="navbar-brand">
        <router-link to="/tenants">
          <img
            src="./../assets/logo.svg"
            width="50"
            height="50"
            alt="Back to Home"
            loading="lazy"
          />
        </router-link>
        <router-link to="/tenants" class="link-underline-opacity-0 link-offset-2 link-underline">
          <h1 class="title">MOOD</h1>
        </router-link>
      </div>
      <div>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div id="navbarNav" class="collapse navbar-collapse">
          <ul class="navbar-nav">
            <li v-for="item in navBarItems" :key="item.path" class="nav-item">
              <router-link class="nav-link" :to="item.path">{{
                $t(`navbar_${item.name}`)
              }}</router-link>
            </li>
          </ul>
        </div>
      </div>
      <div class="position-absolute end-0 mr-5">
        <ul class="navbar-nav">
          <li v-if="userInfo?.name">
            <span class="nav-link text-white">{{ $t('hello') }} {{ userInfo.name }}</span>
          </li>
          <li class="nav-item">
            <button
              id="en"
              :class="`text-uppercase nav-link ${$i18n.locale === 'en' ? 'active' : ''}`"
              @click="changeLanguage('en')"
            >
              EN
            </button>
          </li>
          <li class="nav-item">
            <button
              id="fr"
              :class="`text-uppercase nav-link ${$i18n.locale === 'fr' ? 'active' : ''}`"
              @click="changeLanguage('fr')"
            >
              FR
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted } from 'vue'
import { OAUTH2 } from '..'
import { Authenticate, UserInformation } from '@/plugins/oauth2'

export default defineComponent({
  setup() {
    const authent = inject(OAUTH2) as Authenticate
    const userInfo = ref<UserInformation | null>(null)
    onMounted(async () => {
      userInfo.value = await authent.userInfo()
    })
    return { userInfo }
  },
  name: 'NavBar',
  data: () => ({
    navBarItems: [
      {
        name: 'manageTenant',
        path: '/tenants'
      },
      {
        name: 'manageInstance',
        path: '/instances'
      },
      {
        name: 'manageAcl',
        path: '/acls'
      }
    ]
  }),
  methods: {
    changeLanguage(language: string) {
      this.$i18n.locale = language
    }
  }
})
</script>
