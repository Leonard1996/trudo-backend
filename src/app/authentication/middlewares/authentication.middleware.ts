import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import { User } from '../../user/entities/user.entity'
import { getRepository } from 'typeorm'
export class AuthenticationMiddleware {
  public static hasLoginValidFields = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const loginInput = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    })

    const result = loginInput.validate(request.body, { abortEarly: false })

    if (result.error) {
      return response.status(422).send(result.error)
    }
    next()
  }

  public static hasValidToken = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const token = request.header('Authorization').split('Bearer ')[1]
      response.locals.jwt = jwt.verify(token, process.env.JWT_SECRET_KEY)
      next()
    } catch {
      return response.status(401).json({ message: 'Invalid acces token' })
    }
  }

  public static hasSignUpValidFields = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const signUpInput = Joi.object().keys({
      ...AuthenticationMiddleware.getPasswordFields(),
      username: Joi.string().required(),
    })

    const result = signUpInput.validate(request.body, {
      abortEarly: false,
    })

    if (result.error) {
      return response.status(422).json(result.error)
    }
    next()
  }

  public static hasChangePasswordValidFields = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const changePasswordInput = Joi.object().keys({
      ...AuthenticationMiddleware.getPasswordFields(),
      oldPassword: Joi.string().required(),
    })

    const result = changePasswordInput.validate(request.body, {
      abortEarly: false,
    })

    if (result.error) {
      return response.status(422).json(result.error)
    }
    next()
  }

  public static getPasswordFields = () => {
    return {
      password: Joi.string().min(8).required(),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
    }
  }

  public static isActive = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userRepository = getRepository(User)
    try {
      await userRepository.findOneOrFail({
        where: { id: response.locals.jwt.id, isDeleted: false },
      })
      next()
    } catch (error) {
      return response.status(404).json({ message: 'User is not active' })
    }
  }
}
