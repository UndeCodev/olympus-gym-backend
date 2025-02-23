import { JsonValue } from '@prisma/client/runtime/library'

export interface CompanyProfile {
  id?: number
  logo?: string
  name: string
  slogan: string
  address: string
  zip: string
  phoneNumber: string
  email: string
  socialMedia: JsonValue
}
