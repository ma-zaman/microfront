import { defineStore } from 'pinia'
import { Alert, AlertTypes } from '@mood/web-adapters'
import i18n from '@/plugins/i18n'

type AlertIcons = 'Success' | 'Info' | 'Warning' | 'Error'
export const mappedAlertIcons = new Map<AlertTypes, AlertIcons>([
  [AlertTypes.success, 'Success'],
  [AlertTypes.danger, 'Error'],
  [AlertTypes.info, 'Info'],
  [AlertTypes.warning, 'Warning']
])
export type PiniaAlertContent = {
  title: string
  body: string
  type: AlertTypes
  icon: AlertIcons
  showCloseBtn?: boolean
  response?: string
}
export const alertStore = defineStore('alerts', {
  state: () => {
    return {
      visible: false as boolean,
      type: 'success' as AlertTypes,
      icon: 'Success' as AlertIcons,
      title: '' as string,
      body: '' as string,
      response: '' as string,
      showCloseBtn: true as boolean
    }
  },
  getters: {
    getVisible: (state) => state.visible,
    getType: (state) => state.type,
    getIcon: (state) => state.icon,
    getTitle: (state) => state.title,
    getBody: (state) => state.body,
    getResponse: (state) => state.response,
    getShowCloseBtn: (state) => state.showCloseBtn
  },
  actions: {
    /**
     * Set alert fields
     * @param title Title of the alert (e.g: $t(success))
     * @param body Main message of the alert (e.g: $t(yourTenantHasBeenCreated))
     * @param type Type of the alert (Type: AlertTypes)
     * @param icon Type of Icon on the alert (type: AlertIcons)
     * @param showCloseBtn Boolean set to false to hide the close btn and show spinner (default value set to true)
     * @param response Error response of http request (default value set to empty string)
     */
    setAlert(alertContent: PiniaAlertContent) {
      this.title = alertContent.title
      this.body = alertContent.body
      this.type = alertContent.type
      this.icon = alertContent.icon
      this.response = alertContent.response ?? ''
      this.showCloseBtn = alertContent.showCloseBtn ?? true
    },

    showAlert(content: Alert) {
      this.setAlert({
        ...content,
        body: i18n.global.t(content.details, content.params),
        icon: mappedAlertIcons.get(content.type) ?? 'Info',
        response: ''
      })
      this.visible = true
    },

    showError(title: string, body: string, response: string = '') {
      this.setAlert({
        title: title,
        body: body,
        type: AlertTypes.danger,
        icon: 'Error',
        showCloseBtn: true,
        response
      })
      this.visible = true
    },

    hideAlert() {
      this.visible = false
    }
  }
})
