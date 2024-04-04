import { UUID } from 'crypto'

export interface Tenant {
  id: UUID
  name: string
  description?: string
  labels?: Map<string, string>
  created_at?: Date
  updated_at?: Date
  url?: Record<string, string>  
}