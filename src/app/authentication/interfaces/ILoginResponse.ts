import { IUserResponse } from '../../user/interfaces/IUserResponse'

export interface ILoginResponse extends IUserResponse {
  accessToken: string
  id: number
}
