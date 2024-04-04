import { describe, it, expect } from 'vitest'

import NavBar from '../NavBar.vue'
import { wrapperFactory } from './setup'
import messages from '@/configs/i18n'

describe('Feature: NavBar elements', () => {
  it('should renders properly', () => {
    const wrapper = wrapperFactory(NavBar)
    expect(wrapper.text()).toContain(messages.fr.navbar_manageTenant)
  })
})

describe('Feature: i18n', () => {
  it('should switch text language', async () => {
    const wrapper = wrapperFactory(NavBar)
    expect(wrapper.text()).toContain(messages.fr.navbar_manageTenant)

    await wrapper.find('#en').trigger('click')

    expect(wrapper.text()).toContain(messages.en.navbar_manageTenant)

    await wrapper.find('#fr').trigger('click')

    expect(wrapper.text()).toContain(messages.fr.navbar_manageTenant)
  })
})