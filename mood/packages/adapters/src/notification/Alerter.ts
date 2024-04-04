import { Alert } from '@mood/web-adapters'

export interface Alerter {
  triggerAlert(alert: Alert): void
}
