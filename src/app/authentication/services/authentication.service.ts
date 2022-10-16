import { User } from '../../user/entities/user.entity'
import { getRepository } from 'typeorm'
import jwt from 'jsonwebtoken'
import { ILoginResponse } from '../interfaces/ILoginResponse'
import { Helpers } from '../../common/helpers'

export class AuthenticationService {
  public static login = async (
    username: string,
    password: string
  ): Promise<ILoginResponse> => {
    const userRespository = getRepository(User)

    password = Helpers.hashPassword(password)

    const user = await userRespository.findOneOrFail({
      where: {
        username,
        password,
        isDeleted: false,
      },
    })

    const accessToken = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_LIFETIME_MINUTES }
    )

    return {
      ...user,
      accessToken,
    }
  }

  public static signUp = (username: string, password: string) => {
    const userRespository = getRepository(User)

    password = Helpers.hashPassword(password)

    const user = userRespository.create({ username, password })
    return userRespository.save(user)
  }
}
