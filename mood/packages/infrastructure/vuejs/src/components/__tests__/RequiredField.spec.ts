import { describe, it, expect } from 'vitest'

import RequiredField from '../RequiredField.vue'
import { wrapperFactory } from './setup'

describe('Feature: Required Field', () => {
  describe('Test props interaction', () => {
    it('Should emit in lowercase', async () => {
      const wrapper = await wrapperFactory(
        RequiredField,
        {},
        {
          id: 'required-field',
          lowercase: true,
          labelValue: 'tenantName'
        }
      )

      await wrapper.find('#required-field').setValue('MON-TENANT')
      await wrapper.find('#required-field').trigger('input')

      expect(wrapper.emitted('updateValue')).toBeTruthy()
      expect(wrapper.emitted('updateValue')?.at(0)?.at(0)).toEqual('mon-tenant')
    })

    it('Should use props value to set ', async () => {
      const wrapper = await wrapperFactory(
        RequiredField,
        {},
        {
          id: 'required-field',
          fieldValue: 'mon-tenant',
          labelValue: 'tenantName'
        }
      )

      await wrapper.find('#required-field').trigger('input')

      expect(wrapper.emitted('updateValue')).toBeTruthy()
      expect(wrapper.emitted('updateValue')?.at(0)?.at(0)).toEqual('mon-tenant')
    })
  })
})
