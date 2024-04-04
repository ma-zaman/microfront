import { vi } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { VueWrapper } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import { Authenticate, UserASInformation } from '@/plugins/oauth2'
import { OAUTH2 } from '@/DependencyInjection'

const pinia = createPinia()
setActivePinia(pinia)

const fakeAuthent: Authenticate = {
      userInfo: () => Promise.resolve({ name: "NicolasB" }),
      login: function (): Promise<void> {
        throw new Error('Function not implemented.');
      },
      refreshToken: function (): Promise<UserASInformation> {
        throw new Error('Function not implemented.');
      },
      saveUserInfo: function (data: any): Promise<void> {
        throw new Error('Function not implemented.');
      },
      userNeedToLogin: function (): Promise<boolean> {
        throw new Error('Function not implemented.');
      }
    }
global.ResizeObserver = await require('resize-observer-polyfill')

const wrapperFactory = (component: Object, data: Object = {}, props: Object = {}) =>
  mount(component, {
    data() {
      return data
    },
    propsData: props,
    global: {
      plugins: [i18n, vuetify, pinia],
      provide: {
        [OAUTH2 as symbol]: fakeAuthent
      },
      stubs: {
        RouterLink: RouterLinkStub
      },
      mocks: {
        $axios: {
          moodAPI: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            post: vi.fn((_url, _body) => {
              return new Promise((resolve) => {
                resolve(true)
              })
            })
          }
        }
      }
    }
  })

const setTenantFormFields = (
  wrapper: VueWrapper,
  name: String,
  labels: String,
  description: String
) => {
  wrapper.find('#tenantNameField').setValue(name)
  wrapper.find('#tenantLabelField').setValue(labels)
  wrapper.find('#tenantDescriptionField').setValue(description)
}

export { wrapperFactory, setTenantFormFields }
