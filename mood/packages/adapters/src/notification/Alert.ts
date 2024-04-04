export type Alert = {
  title: string
  details: string
  type: AlertTypes
  params: any
}

export enum AlertTypes {
  success = 'success',
  info = 'info',
  warning = 'warning',
  danger = 'danger'
}
