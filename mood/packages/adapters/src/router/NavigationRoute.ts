import { Tenant } from '@mood/domain'
import { UUID } from 'crypto'

export type NavigationRouteURL = string

export class NavigationRoute {
  static LOGIN: NavigationRouteURL = '/login'

  static TENANTS: NavigationRouteURL = '/'
  static TENANT(tenant: Tenant): NavigationRouteURL {
    return `/tenant/${tenant.id}`
  }

  static ACLS: NavigationRouteURL = '/acls'
  static ACL(tenantId: UUID): NavigationRouteURL {
    return `/tenants/${tenantId}/acls`
  }

  static INSTANCES: NavigationRouteURL = '/instances'
  static INSTANCE(tenantId: UUID): NavigationRouteURL {
    return `/tenants/${tenantId}/instances`
  }
}
