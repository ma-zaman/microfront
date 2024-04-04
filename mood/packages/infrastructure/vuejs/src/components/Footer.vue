<template>
  <footer class="footer bg-dark navbar-dark mb-auto fixed-bottom">
    <h2 class="visually-hidden">Sitemap & information</h2>
    <div class="container-xxl footer-terms">
      <ul class="navbar-nav gap-md-3">
        <li class="fw-bold">© Orange 2024</li>
        <li class="fw-bold">
          <a :href="docURL" target="_blank">Documentation</a>
        </li>
        <li class="fw-bold">
          <a :href="cguURL" target="_blank">CGU</a>
        </li>
        <li class="fw-bold">
          <a :href="faqURL" target="_blank">FAQ</a>
        </li>
        <li class="fw-bold">
          <a :href="mattermostURL" target="_blank">Mattermost</a>
        </li>
        <li class="fw-bold"><a :href="`mailto:${supportMail}`">Mail</a></li>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  setup() {
    const docURL = process.env.VITE_DOC_URL
    const cguURL = process.env.VITE_CGU_URL
    const faqURL = process.env.VITE_FAQ_URL
    const supportMail = process.env.VITE_SUPPORT_MAIL
    const mattermostURL = process.env.VITE_SUPPORT_MATTERMOST

    return { docURL, cguURL, faqURL, supportMail, mattermostURL }
  },
  name: 'MyFooter'
}
</script>
