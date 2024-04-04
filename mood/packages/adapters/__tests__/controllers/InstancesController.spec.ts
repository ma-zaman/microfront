import {
  InstanceBuilder,
  GetInstancesPresentation,
  GetInstancesRequest,
  Instance
} from '@mood/domain'
import { InstancesController, InstancesPresenter, TenantStore } from '@mood/web-adapters'
import { GetInstancesUseCaseBuilder } from '__tests__/builders/GetInstancesUseCaseBuilder'
import { expect, describe, test } from 'vitest'

describe('InstancesController', () => {
  test('fetch instances update instances vm', async () => {
    // Given

    const instanceBuilder = new InstanceBuilder()
    const store = new TenantStore()

    const instance0: Instance = instanceBuilder
      .withInstanceType('prometheus')
      .withId('00000000-0000-0000-0000-000000000000')
      .withName('prom 01')
      .withDescription('desc prom 01')
      .withRelatedConfigs([
        '99999999-0000-0000-0000-000000000000',
        '88888888-0000-0000-0000-000000000000'
      ])
      .withRelatedServiceInstances([])
      .withUrls([
        'https://my-tenant---vm-infra.prom.nd2.mood-preprod.si.fr.intraorange',
        'https://00000eee-12ab-417c-876c-168dc15a0520.prom.nd2.mood-preprod.si.fr.intraorange'
      ])
      .withInternalUrl(
        'http://svm-00000eee-12ab-417c-876c-168dc15a0520.mood-tenant-11111111-aaaa-4888-8e3c-827181ecd0fc.svc.bmsmood.local:8428'
      )
      .withVisibility('private')
      .withTenantName('tenant0')
      .withTenantId('33333333-3333-3333-3333-333333333333')
      .build()

    const getInstancesUseCase = new GetInstancesUseCaseBuilder()
      .withExecute((request: GetInstancesRequest, presenter: GetInstancesPresentation) => {
        presenter.displayInstances([instance0])
        return Promise.resolve()
      })
      .build()
    const presenter = new InstancesController(getInstancesUseCase, new InstancesPresenter(store))

    // When
    await presenter.fetchInstances()

    // Then
    expect(presenter.vm.instances).toEqual([instance0])
  })
})
