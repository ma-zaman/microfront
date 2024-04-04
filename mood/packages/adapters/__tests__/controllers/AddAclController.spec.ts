import {
  AddAclPresentation,
  AddAclRequest,
  AclBuilder,
  NewAclFields,
  Acl,
  RoleTypes,
  AclOwnerTypes
} from '@mood/domain'
import {
  AddAclController,
  AddAclPresenter,
  FakeNavigation,
  NavigationRoute
} from '@mood/web-adapters'
import { AddAclUseCaseBuilder } from '../builders/AddAclCaseBuilder'
import { describe, test, expect } from 'vitest'

describe('AddAclController', () => {
  test('display acl error on validate Owner', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withValidate((_: AddAclRequest, presenter: AddAclPresentation) => {
        const errors = new Map<NewAclFields, string>()
        errors.set(NewAclFields.owner, 'Acl Owner required')
        presenter.notifyNewAclFieldError(errors)
        return errors
      })
      .build()

    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.validateAclOwner('')

    // Then
    expect(controller.vm.aclOwnerError).toBe('Acl Owner required')
    expect(controller.vm.aclOwnerTouched).toBeTruthy()
    expect(controller.vm.canCreateAcl).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on validate OwnerType', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withValidate((_: AddAclRequest, presenter: AddAclPresentation) => {
        const errors = new Map<NewAclFields, string>()
        errors.set(NewAclFields.ownerType, 'OwnerType required')
        presenter.notifyNewAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.validateAclOwnerType('' as AclOwnerTypes)

    // Then
    expect(controller.vm.aclOwnerTypeError).toBe('OwnerType required')
    expect(controller.vm.aclOwnerTypeTouched).toBeTruthy()
    expect(controller.vm.canCreateAcl).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on validate Role', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withValidate((_: AddAclRequest, presenter: AddAclPresentation) => {
        const errors = new Map<NewAclFields, string>()
        errors.set(NewAclFields.role, 'Role required')
        presenter.notifyNewAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.validateAclRole('' as RoleTypes)

    // Then
    expect(controller.vm.aclRoleError).toBe('Role required')
    expect(controller.vm.aclRoleTouched).toBeTruthy()
    expect(controller.vm.canCreateAcl).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on validate TenantName', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withValidate((_: AddAclRequest, presenter: AddAclPresentation) => {
        const errors = new Map<NewAclFields, string>()
        errors.set(NewAclFields.tenantName, 'TenantName required')
        presenter.notifyNewAclFieldError(errors)
        return errors
      })
      .build()
    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.validateAclTenantName('')

    // Then
    expect(controller.vm.aclTenantNameError).toBe('TenantName required')
    expect(controller.vm.aclTenantNameTouched).toBeTruthy()
    expect(controller.vm.canCreateAcl).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl error on create', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withExecute((_: AddAclRequest, presenter: AddAclPresentation) => {
        const errors = new Map<NewAclFields, string>()
        errors.set(NewAclFields.owner, 'Acl name required')
        errors.set(NewAclFields.ownerType, 'OwnerType required')
        errors.set(NewAclFields.role, 'Role required')
        errors.set(NewAclFields.tenantName, 'TenantName required')
        presenter.notifyNewAclFieldError(errors)
        return Promise.resolve()
      })
      .build()
    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.create()

    // Then
    expect(controller.vm.canCreateAcl).toBeFalsy()
    expect(controller.vm.displayAlert).toBeFalsy()
  })

  test('display acl notification on create', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withExecute((_: AddAclRequest, presenter: AddAclPresentation) => {
        const acl: Acl = new AclBuilder()
          .withOwner('ownerTest')
          .withOwnerType('user')
          .withRole('administrator')
          .withTenantName('tenant-test')
          .withTenantId('00000000-0000-0000-0000-000000000000')
          .build()
        presenter.notifyAclAdded(acl)
        return Promise.resolve()
      })
      .build()

    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.create()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('success')
    expect(controller.vm.alert.details).toBe('yourAclHasBeenCreated')
  })

  test('display notification on repository error', () => {
    // Given
    const useCase = new AddAclUseCaseBuilder()
      .withExecute((_: AddAclRequest, presenter: AddAclPresentation) => {
        const acl: Acl = new AclBuilder().build()
        presenter.notifyAddAclError('API Error !')
        return Promise.resolve()
      })
      .build()

    const controller = new AddAclController(useCase, new AddAclPresenter(new FakeNavigation()))

    // When
    controller.create()

    // Then
    expect(controller.vm.displayAlert).toBeTruthy()
    expect(controller.vm.alert.title).toBe('error')
    expect(controller.vm.alert.details).toBe('API Error !')
  })

  test('redirect to acl on create success', async () => {
    // Given
    const acl = new AclBuilder()
      .withOwner('ownerTest')
      .withOwnerType('user')
      .withRole('administrator')
      .withTenantName('tenant-test')
      .withTenantId('00000000-0000-0000-0000-000000000000')
      .build()
    const navigation = new FakeNavigation()

    await new Promise<void>((resolve) => {
      const useCase = new AddAclUseCaseBuilder()
        .withExecute((_: AddAclRequest, presenter: AddAclPresentation) => {
          presenter.notifyAclAdded(acl)
          return Promise.resolve().then(() => resolve())
        })
        .build()
      const controller = new AddAclController(useCase, new AddAclPresenter(navigation))

      // When
      controller.create()
    })

    // Then
    expect(navigation.currentRoute).toBe(NavigationRoute.ACLS)
  })
})
