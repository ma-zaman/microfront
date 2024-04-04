import { AclRepository, Acl } from '@mood/domain'
import { UUID } from 'crypto'

const INITIAL_ACLS: any[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    owner: 'user0',
    ownerType: 'user',
    role: 'administrator',
    tenantName: 'my-tenant',
    tenantId: '00000000-0000-0000-0000-000000000000'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    owner: 'team0',
    ownerType: 'team',
    role: 'administrator',
    tenantId: '00000000-0000-0000-0000-000000000000',
    tenantName: 'my-tenant'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    owner: 'team1',
    ownerType: 'team',
    role: 'administrator',
    tenantId: '10000000-0000-0000-0000-000000000000',
    tenantName: 'my-tenant-2'
  }
]

export class AclRepositoryInMemory implements AclRepository {
  constructor(private acls: Acl[] = INITIAL_ACLS) {}

  getAcls(tenantId: UUID, tenantName: string): Promise<Acl[]> {
    return Promise.resolve(this.acls.filter((e) => e.tenantId === tenantId))
  }

  addAcl(acl: Acl): Promise<void> {
    this.acls.push(acl)
    return Promise.resolve()
  }

  updateAcl(acl: Acl): Promise<void> {
    const index = this.acls.findIndex((item) => item.owner === acl.owner)
    this.acls[index] = acl
    return Promise.resolve()
  }

  deleteAcl(acl: Acl): Promise<void> {
    this.acls = this.acls.filter((el) => el.owner !== acl.owner)
    return Promise.resolve()
  }
}
