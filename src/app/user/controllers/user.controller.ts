import { Request, Response } from 'express'
import { PaginateDto } from '../../common/paginate.dto'
import { UserService } from '../services/user.service'

export class UserController {
  public static getMe = async (request: Request, response: Response) => {
    try {
      const me = await UserService.getMe(response.locals.jwt.id)
      response.status(200).json({ me })
    } catch (error) {
      response.status(404).json({ message: 'User does not exist' })
    }
  }

  public static updatePassword = async (
    request: Request,
    response: Response
  ) => {
    try {
      const result = await UserService.updatePassword(
        response.locals.jwt.id,
        request.body
      )
      if (result.affected === 0) throw new Error()

      response.status(204).send()
    } catch (error) {
      response.status(404).json({ message: 'Current password mismatch' })
    }
  }

  public static getById = async (request: Request, response: Response) => {
    try {
      const user = await UserService.getById(+request.params.id)
      response.status(200).json({ user })
    } catch (error) {
      response
        .status(404)
        .json({ message: 'User does not exist or is inactive' })
    }
  }

  public static like = async (request: Request, response: Response) => {
    try {
      await UserService.like(+request.params.id, +response.locals.jwt.id)
      response.status(201).json({ message: 'Success' })
    } catch (error) {
      response.status(409).json({ message: 'Could not like user' })
    }
  }
  public static unlike = async (request: Request, response: Response) => {
    try {
      await UserService.unlike(+request.params.id, +response.locals.jwt.id)
      response.status(204).send()
    } catch (error) {
      response.status(409).json({ message: 'Could not unlike user' })
    }
  }

  public static getMostLiked = async (request: Request, response: Response) => {
    try {
      const entries = await UserService.getMostLiked(
        request.query as unknown as PaginateDto
      )
      response.status(200).json(entries)
    } catch (error) {
      response.status(400).json({ message: 'Something went wrong' })
    }
  }
}
