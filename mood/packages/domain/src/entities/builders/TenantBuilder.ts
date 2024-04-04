import { Tenant } from '@mood/domain'
import { UUID } from 'crypto'

export class TenantBuilder {
  private id!: UUID
  private name!: string
  private labels?: Map<string, string>
  private description?: string
  private updated_at?: Date
  private url?: Record<string, string>

  withName(name: string) {
    this.name = name
    return this
  }

  withLabels(labels: any) {
    this.labels = labels
    return this
  }

  withDescription(description: string) {
    this.description = description
    return this
  }

  withUpdatedAt(updated_at: Date) {
    this.updated_at = updated_at
    return this
  }

  withUrl(url: Record<string, string>) {
    this.url = url
    return this
  }

  withId(id: UUID) {
    this.id = id
    return this
  }
  build(): Tenant {
    const created_at = new Date()
    let uuid = crypto.randomUUID()

    return {
      id: this.id ?? uuid,
      name: this.name,
      labels: this.labels,
      description: this.description,
      created_at: created_at,
      updated_at: this.updated_at ? this.updated_at : created_at,
      url: this.url
    }
  }
}
