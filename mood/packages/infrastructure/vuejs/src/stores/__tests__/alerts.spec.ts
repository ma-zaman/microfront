import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { alertStore } from '@/stores/alerts'
import { AlertTypes } from '@mood/web-adapters'

describe('Feature: Store alertBar data', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('Should initialize alert with default values', () => {
    const alert = alertStore()
    expect(alert.visible).toBe(false)
    expect(alert.type).toBe('success')
    expect(alert.icon).toBe('Success')
    expect(alert.title).toBe('')
    expect(alert.body).toBe('')
    expect(alert.response).toBe('')
    expect(alert.showCloseBtn).toBe(true)
  })
  it('Should set alert with given values', () => {
    const alert = alertStore()
    alert.setAlert({
      title: 'Title',
      body: 'body',
      type: AlertTypes.info,
      icon: 'Info',
      showCloseBtn: false
    })
    expect(alert.visible).toBe(false)
    expect(alert.type).toBe('info')
    expect(alert.icon).toBe('Info')
    expect(alert.title).toBe('Title')
    expect(alert.body).toBe('body')
    expect(alert.response).toBe('')
    expect(alert.showCloseBtn).toBe(false)
  })
  it('Should show and set alert with given values', () => {
    const alert = alertStore()
    alert.showAlert({ title: 'Title', details: 'testMessageWithVariable', params: { msg: 'coucou' }, type: AlertTypes.info })
    expect(alert.getVisible).toBe(true)
    expect(alert.getType).toBe('info')
    expect(alert.getIcon).toBe('Info')
    expect(alert.getTitle).toBe('Title')
    expect(alert.getBody).toBe('Ceci est un message avec coucou')
    expect(alert.getResponse).toBe('')
    expect(alert.getShowCloseBtn).toBe(true)
  })
  it('Should show then hide alert', () => {
    const alert = alertStore()
    alert.showAlert({ title: 'Title', details: 'body', type: AlertTypes.info, params: {} })
    expect(alert.visible).toBe(true)
    alert.hideAlert()
    expect(alert.visible).toBe(false)
  })
})
