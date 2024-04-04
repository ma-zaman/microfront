import { AclRepository, Acl } from '@mood/domain'
import { HttpClient } from '@mood/web-adapters'
import { UUID } from 'crypto'

export class AclRepositoryMood implements AclRepository {
  private API_URI = '/v1/tenants'

  constructor(
    private http: HttpClient,
    private apiBaseUrl: string
  ) {}

  async getAcls(tenantId: UUID, tenantName: string): Promise<Acl[]> {
    const rawAcls = await this.http.get<any[]>(
      this.apiBaseUrl + this.API_URI + '/' + tenantId + '/acls'
    )

    // 1. Rename subject_name and subject_type in owner and ownerType
    // 2. Add missing tenant info not returned by the API
    const acls = rawAcls.map((e) => {
      return {
        ...e,
        id: e.subject_id,
        owner: e.subject_name,
        ownerType: e.subject_type,
        tenantId: tenantId,
        tenantName: tenantName
      }
    })

    return acls
  }

  addAcl(acl: Acl): Promise<void> {
    const body = {
      subject_name: acl.owner,
      subject_type: acl.ownerType,
      role: acl.role
    }
    return this.http.post(this.apiBaseUrl + this.API_URI + '/' + acl.tenantId + '/acls', body)
  }

  updateAcl(acl: Acl): Promise<void> {
    const body = {
      role: acl.role
    }
    return this.http.put(
      this.apiBaseUrl + this.API_URI + '/' + acl.tenantId + '/acls/' + acl.ownerType + '/' + acl.id,
      body
    )
  }

  deleteAcl(acl: Acl): Promise<void> {
    return this.http.delete(
      this.apiBaseUrl + this.API_URI + '/' + acl.tenantId + '/acls/' + acl.ownerType + '/' + acl.id
    )
  }
}
