import { Acl } from '@mood/domain'
import { UUID } from 'crypto'

export interface AclRepository {
  getAcls(tenantId: UUID, tenantName: string): Promise<Acl[]>
  addAcl(acl: Acl): Promise<void>
  updateAcl(acl: Acl): Promise<void>
  deleteAcl(acl: Acl): Promise<void>
}
