import { Request, Response } from 'express'
import { AuthenticationService } from '../services/authentication.service'

export class AuthenticationController {
  public static login = async (request: Request, response: Response) => {
    const {
      body: { username, password },
    } = request

    try {
      const user = await AuthenticationService.login(username, password)
      response.status(200).json({
        user,
      })
    } catch (error) {
      response.status(401).json({ message: 'Wrong credentials' })
    }
  }

  public static signUp = async (request: Request, response: Response) => {
    const {
      body: { username, password },
    } = request

    try {
      await AuthenticationService.signUp(username, password)
      response.status(201).send({
        message: 'Success',
      })
    } catch (error) {
      response.status(409).send({ message: 'User already exists' })
    }
  }
}
