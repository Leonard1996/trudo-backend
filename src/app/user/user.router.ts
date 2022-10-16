import express from 'express'
import { AuthenticationMiddleware } from '../authentication/middlewares/authentication.middleware'
import { UserController } from './controllers/user.controller'

export class UserRouter {
  public static configRoutes = (app: express.Application) => {
    app.get('/me', [
      AuthenticationMiddleware.hasValidToken,
      AuthenticationMiddleware.isActive,
      UserController.getMe,
    ])

    app.patch('/me/update-password', [
      AuthenticationMiddleware.hasValidToken,
      AuthenticationMiddleware.isActive,
      AuthenticationMiddleware.hasChangePasswordValidFields,
      UserController.updatePassword,
    ])

    app.get('/users/:id', [UserController.getById])

    app.post('/users/:id/like', [
      AuthenticationMiddleware.hasValidToken,
      AuthenticationMiddleware.isActive,
      UserController.like,
    ])

    app.delete('/users/:id/unlike', [
      AuthenticationMiddleware.hasValidToken,
      AuthenticationMiddleware.isActive,
      UserController.unlike,
    ])

    app.get('/most-liked', [UserController.getMostLiked])
  }
}
