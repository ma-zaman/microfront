/**
 * plugins/i18n.ts
 *
 * Framework documentation: https://vue-i18n.intlify.dev`
 */

// Composables
import { createI18n } from 'vue-i18n'
import messages from '@/configs/i18n'

export default createI18n({
  locale: 'fr',
  fallbackLocale: 'en',
  messages
})
