// FIXME: divide this file into separated files by usecase
import type { App, InjectionKey } from 'vue'
import {
  AddTenantUseCase,
  DeleteTenantUseCase,
  GetTenantsUseCase,
  GetAclsUseCase,
  GetInstancesUseCase,
  TenantRepository,
  UpdateTenantUseCase,
  AclRepository,
  InstanceRepository,
  AddAclUseCase,
  UpdateAclUseCase,
  DeleteAclUseCase,
  Tenant,
  DeleteInstanceUseCase,
  AddInstanceUseCase,
  UpdateInstanceUseCase
} from '@mood/domain'
import {
  NavigationRoute,
  HttpClient,
  AddTenantControllerFactory,
  TenantRepositoryInMemory,
  DeleteTenantControllerFactory,
  TenantsControllerFactory,
  TenantRepositoryMood,
  Alert,
  Alerter,
  UpdateTenantControllerFactory,
  AclsControllerFactory,
  AclRepositoryInMemory,
  InstanceRepositoryInMemory,
  AclRepositoryMood,
  InstanceRepositoryMood,
  Store,
  AddAclControllerFactory,
  UpdateAclControllerFactory,
  DeleteAclControllerFactory,
  TenantStore,
  InstancesControllerFactory,
  DeleteInstanceControllerFactory,
  AddInstanceControllerFactory,
  UpdateInstanceControllerFactory
} from '@mood/web-adapters'

import router from '@/router'
import { alertStore } from '@/stores/alerts'
import { RELOGIN_MSG, createMoodAPIAxios } from '@/plugins/axios'
import { FullUserInformation, Oauth2Authenticate } from '@/plugins/oauth2'

export const ADD_TENANT_CONTROLLER_FACTORY: InjectionKey<AddTenantControllerFactory> = Symbol()
export const UPDATE_TENANT_CONTROLLER_FACTORY: InjectionKey<UpdateTenantControllerFactory> =
  Symbol()
export const DELETE_TENANT_CONTROLLER_FACTORY: InjectionKey<DeleteTenantControllerFactory> =
  Symbol()
export const TENANTS_CONTROLLER_FACTORY: InjectionKey<TenantsControllerFactory> = Symbol()

export const USERS_CONTROLLER_FACTORY: InjectionKey<AclsControllerFactory> = Symbol()
export const ADD_ACL_CONTROLLER_FACTORY: InjectionKey<AddAclControllerFactory> = Symbol()
export const UPDATE_ACL_CONTROLLER_FACTORY: InjectionKey<UpdateAclControllerFactory> = Symbol()
export const DELETE_ACL_CONTROLLER_FACTORY: InjectionKey<DeleteAclControllerFactory> = Symbol()

export const INSTANCES_CONTROLLER_FACTORY: InjectionKey<InstancesControllerFactory> = Symbol()
export const ADD_INSTANCE_CONTROLLER_FACTORY: InjectionKey<AddInstanceControllerFactory> = Symbol()
export const UPDATE_INSTANCE_CONTROLLER_FACTORY: InjectionKey<UpdateInstanceControllerFactory> =
  Symbol()
export const DELETE_INSTANCE_CONTROLLER_FACTORY: InjectionKey<DeleteInstanceControllerFactory> =
  Symbol()

export const ALERT: InjectionKey<Alerter> = Symbol()
export const OAUTH2: InjectionKey<Oauth2Authenticate> = Symbol()

export const dependencies = (app: App) => {
  const storageUser = getUserStorage()
  const authorizedHeader = (headers: any) => {
    return { ...headers, Authorization: `Bearer ${storageUser.get()?.accessToken ?? ''}` }
  }
  const navigation = {
    navigate(route: NavigationRoute): Promise<void> {
      return router.push(route).then()
    }
  }
  const oauth = new Oauth2Authenticate(navigation, storageUser)
  // FIXME: Better to use oauth inside interceptors. Check axios.ts in plugins for more details
  // const moodAPIAxios = createMoodAPIAxios(oauth)
  const moodAPIAxios = createMoodAPIAxios()

  const httpClient: HttpClient = {
    async get<T>(url: string, headers: any = {}): Promise<T> {
      // FIXME : Quick & dirty try/catch. Check interceptors in axios.ts in plugins for more details
      try {
        const response = await moodAPIAxios.get(url, { headers: authorizedHeader(headers) })
        return response.data
      } catch (err: any) {
        if (err.message === RELOGIN_MSG) {
          await oauth.login()
          const response = await moodAPIAxios.get(url, { headers: authorizedHeader(headers) })
          return response.data
        }
        throw err
      }
    },
    async post<T>(url: string, body: Object, headers: any = {}): Promise<T> {
      try {
        return await moodAPIAxios.post(url, body, { headers: authorizedHeader(headers) })
      } catch (err: any) {
        if (err.message === RELOGIN_MSG) {
          await oauth.login()
          return await moodAPIAxios.post(url, body, { headers: authorizedHeader(headers) })
        }
        throw err
      }
    },
    async put<T>(url: string, body: Object, headers: any = {}): Promise<T> {
      try {
        return await moodAPIAxios.put(url, body, { headers: authorizedHeader(headers) })
      } catch (err: any) {
        if (err.message === RELOGIN_MSG) {
          await oauth.login()
          return await moodAPIAxios.put(url, body, { headers: authorizedHeader(headers) })
        }
        throw err
      }
    },
    async delete(url: string, headers: any = {}): Promise<void> {
      try {
        const response = await moodAPIAxios.delete(url, { headers: authorizedHeader(headers) })
        return response.data
      } catch (err: any) {
        if (err.message === RELOGIN_MSG) {
          await oauth.login()
          const response = await moodAPIAxios.delete(url, { headers: authorizedHeader(headers) })
          return response.data
        }
        throw err
      }
    }
  }

  // Check before each redirection if user need to be logged
  router.beforeEach(async (to, _, next) => {
    // Nested else are needed in this case
    if (false) {
      if ((await oauth.userNeedToLogin()) && to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    } else {
      next()
    }
  })

  const aStore = alertStore()
  const alerter: Alerter = {
    triggerAlert(data: Alert): void {
      aStore.showAlert(data)
    }
  }

  const tenantStorage: Store<Tenant> = new TenantStore()

  // Choice of tenant repository
  const { aclRepository, instanceRepository, tenantRepository } = getRepositories(httpClient)

  // Define controllers to use ...
  const addTenantUseCase = new AddTenantUseCase(tenantRepository)
  const addTenantControllerFactory = new AddTenantControllerFactory(addTenantUseCase, navigation)

  const updateTenantUseCase = new UpdateTenantUseCase(tenantRepository)
  const updateTenantControllerFactory = new UpdateTenantControllerFactory(
    updateTenantUseCase,
    navigation
  )

  const deleteTenantUseCase = new DeleteTenantUseCase(tenantRepository)
  const deleteTenantControllerFactory = new DeleteTenantControllerFactory(
    deleteTenantUseCase,
    navigation
  )

  const getTenantsUseCase = new GetTenantsUseCase(tenantRepository)
  const tenantsControllerFactory = new TenantsControllerFactory(
    getTenantsUseCase,
    navigation,
    tenantStorage
  )

  const getInstancesUseCase = new GetInstancesUseCase(instanceRepository)
  const instancesControllerFactory = new InstancesControllerFactory(
    getInstancesUseCase,
    tenantStorage
  )

  const addInstanceUseCase = new AddInstanceUseCase(instanceRepository)
  const addInstanceControllerFactory = new AddInstanceControllerFactory(
    addInstanceUseCase,
    navigation
  )

  const updateInstanceUseCase = new UpdateInstanceUseCase(instanceRepository)
  const updateInstanceControllerFactory = new UpdateInstanceControllerFactory(
    updateInstanceUseCase,
    navigation
  )

  const deleteInstanceUseCase = new DeleteInstanceUseCase(instanceRepository)
  const deleteInstanceControllerFactory = new DeleteInstanceControllerFactory(
    deleteInstanceUseCase,
    navigation
  )

  const getAclsUseCase = new GetAclsUseCase(aclRepository)
  const aclsControllerFactory = new AclsControllerFactory(getAclsUseCase, tenantStorage)

  const addAclUseCase = new AddAclUseCase(aclRepository)
  const addAclControllerFactory = new AddAclControllerFactory(addAclUseCase, navigation)

  const updateAclUseCase = new UpdateAclUseCase(aclRepository)
  const updateAclControllerFactory = new UpdateAclControllerFactory(updateAclUseCase, navigation)

  const deleteAclUseCase = new DeleteAclUseCase(aclRepository)
  const deleteAclControllerFactory = new DeleteAclControllerFactory(deleteAclUseCase, navigation)

  // Dependecy injection ...
  app.provide(ADD_TENANT_CONTROLLER_FACTORY, addTenantControllerFactory)
  app.provide(UPDATE_TENANT_CONTROLLER_FACTORY, updateTenantControllerFactory)
  app.provide(DELETE_TENANT_CONTROLLER_FACTORY, deleteTenantControllerFactory)
  app.provide(TENANTS_CONTROLLER_FACTORY, tenantsControllerFactory)
  app.provide(USERS_CONTROLLER_FACTORY, aclsControllerFactory)
  app.provide(INSTANCES_CONTROLLER_FACTORY, instancesControllerFactory)
  app.provide(ADD_INSTANCE_CONTROLLER_FACTORY, addInstanceControllerFactory)
  app.provide(UPDATE_INSTANCE_CONTROLLER_FACTORY, updateInstanceControllerFactory)
  app.provide(DELETE_INSTANCE_CONTROLLER_FACTORY, deleteInstanceControllerFactory)
  app.provide(ADD_ACL_CONTROLLER_FACTORY, addAclControllerFactory)
  app.provide(UPDATE_ACL_CONTROLLER_FACTORY, updateAclControllerFactory)
  app.provide(DELETE_ACL_CONTROLLER_FACTORY, deleteAclControllerFactory)
  app.provide(ALERT, alerter)
  app.provide(OAUTH2, oauth)
}

const getRepositories = (httpClient: HttpClient) => {
  const apiUrl = process.env.VITE_MOOD_API_URL ?? 'APIUrlNotFilled'
  let tenantRepository: TenantRepository
  let aclRepository: AclRepository
  let instanceRepository: InstanceRepository

  if (true) {
    tenantRepository = new TenantRepositoryInMemory()
    aclRepository = new AclRepositoryInMemory()
    instanceRepository = new InstanceRepositoryInMemory()
  } else {
    tenantRepository = new TenantRepositoryMood(httpClient, apiUrl)
    aclRepository = new AclRepositoryMood(httpClient, apiUrl)
    instanceRepository = new InstanceRepositoryMood(httpClient, apiUrl)
  }

  return { aclRepository, instanceRepository, tenantRepository }
}

const getUserStorage = () => {
  if (true) {
    return new UserLocalStorage()
  }
  return new UserCookieSecureStorage()
}
class UserLocalStorage implements Store<FullUserInformation> {
  get(): FullUserInformation | null {
    const accessToken = window.localStorage.getItem('access_token') ?? undefined
    const idToken = window.localStorage.getItem('id_token') ?? undefined
    const refreshToken = window.localStorage.getItem('refresh_token') ?? undefined
    const codeVerifier = window.localStorage.getItem('code_verifier') ?? undefined
    const sub = window.localStorage.getItem('sub') ?? undefined
    const name = window.localStorage.getItem('name') ?? undefined
    const email = window.localStorage.getItem('email') ?? undefined
    return { accessToken, idToken, refreshToken, codeVerifier, sub, name, email }
  }

  set(userInfo: FullUserInformation): void {
    window.localStorage.setItem('access_token', userInfo.accessToken ?? '')
    window.localStorage.setItem('id_token', userInfo.idToken ?? '')
    window.localStorage.setItem('refresh_token', userInfo.refreshToken ?? '')
    window.localStorage.setItem('code_verifier', userInfo.codeVerifier ?? '')
    window.localStorage.setItem('sub', userInfo.sub ?? '')
    window.localStorage.setItem('name', userInfo.name ?? '')
    window.localStorage.setItem('email', userInfo.email ?? '')
  }

  clear(): void {
    window.localStorage.clear()
  }
}

class UserCookieSecureStorage implements Store<FullUserInformation> {
  get(): FullUserInformation | null {
    const accessToken = this.readCookie('access_token')
    const idToken = this.readCookie('id_token')
    const refreshToken = this.readCookie('refresh_token')
    const codeVerifier = this.readCookie('code_verifier')
    const sub = this.readCookie('sub')
    const name = this.readCookie('name')
    const email = this.readCookie('email')
    return { accessToken, idToken, refreshToken, codeVerifier, sub, name, email }
  }

  set(userInfo: FullUserInformation): void {
    this.writeCookie('access_token', userInfo.accessToken)
    this.writeCookie('id_token', userInfo.idToken)
    this.writeCookie('refresh_token', userInfo.refreshToken)
    this.writeCookie('code_verifier', userInfo.codeVerifier)
    this.writeCookie('sub', userInfo.sub)
    this.writeCookie('name', userInfo.name)
    this.writeCookie('email', userInfo.email)
  }

  clear(): void {
    this.deleteCookie('access_token')
    this.deleteCookie('id_token')
    this.deleteCookie('refresh_token')
    this.deleteCookie('code_verifier')
    this.deleteCookie('sub')
    this.deleteCookie('name')
    this.deleteCookie('email')
  }

  private writeCookie(name: string, value?: string): void {
    if (value) {
      document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
        value
      )};secure;path=/;samesite=strict`
    }
  }

  private readCookie(name: string): string | undefined {
    const nameEQ = encodeURIComponent(name) + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length))
    }
    return undefined
  }

  private deleteCookie(name: string): void {
    document.cookie = `${encodeURIComponent(
      name
    )}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;secure;path=/;samesite=strict`
  }
}
