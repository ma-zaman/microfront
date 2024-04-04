import i18n from '@/plugins/i18n'

const t = i18n.global.t

const rules = {
  required: (v: string) => !!v || t('thisFieldIsRequired'),
  tenant: {
    name: [
      (v: string) => (v && v.length >= 3 && v.length <= 30) || t('thisFieldMustContainBetween3And30Characters'),
      (va: string) =>
        /(?!^all$)(^[0-9a-zA-Z][0-9a-zA-Z-]+[0-9a-zA-Z]$)/.test(va) ||
        t('onlyHyphenIsAllowed')
    ],
    labels: [(lv: string) => /^[0-9]{1,5}$/.test(lv) || t('thisFieldMustContainBetween1And5Digits')],
    description: (dv: string) =>
      (dv && dv.length <= 1000) || t('thisFieldMustBeLessThan1000Characters')
  }
}

export default rules
