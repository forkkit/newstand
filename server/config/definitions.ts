import { Request } from "express"

export interface userRequest extends Request {
  profile: any,
  token: string
}