import express from 'express'
import { AuthenticationController } from './controllers/authentication.controller'
import { AuthenticationMiddleware } from './middlewares/authentication.middleware'

export class AuthenticationRouter {
  public static configRoutes = (app: express.Application) => {
    app.post('/login', [
      AuthenticationMiddleware.hasLoginValidFields,
      AuthenticationController.login,
    ])

    app.post('/signup', [
      AuthenticationMiddleware.hasSignUpValidFields,
      AuthenticationController.signUp,
    ])
  }
}
