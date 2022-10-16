import { Connection, createConnection } from 'typeorm'
import request from 'supertest'
import { app } from '../src/app'
import { ILoginResponse } from '../src/app/authentication/interfaces/ILoginResponse'

let connection: Connection, server: any, currentUser: ILoginResponse

const user = {
  username: 'test',
  password: '12345678',
}

beforeAll(async () => {
  connection = await createConnection()
  server = app.listen()
})

afterAll(async () => {
  connection.close()
  server.close()
})

it('should create user account', async () => {
  const response = await request(app)
    .post('/signUp')
    .send({
      ...user,
      confirmPassword: '12345678',
    })
  expect(response.statusCode).toBe(201)
  expect(response.body).toEqual({ message: 'Success' })
})

it('should authenticate a user', async () => {
  const response = await request(app)
    .post('/login')
    .send({
      ...user,
    })
  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('user')
  expect(response.body.user).toHaveProperty('accessToken')
  currentUser = response.body.user
})

it('should get current user', async () => {
  const response = await request(app)
    .get('/me')
    .set('Authorization', 'Bearer ' + currentUser.accessToken)

  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('me')
  expect(response.body.me.username).toBe(user.username)
})

it('should update current user password', async () => {
  const response = await request(app)
    .patch('/me/update-password')
    .set('Authorization', 'Bearer ' + currentUser.accessToken)
    .send({
      password: 'newpassword',
      confirmPassword: 'newpassword',
      oldPassword: user.password,
    })

  expect(response.statusCode).toBe(204)
})

it('should get user by id and likes', async () => {
  const response = await request(app).get('/users/' + currentUser.id)
  expect(response.statusCode).toBe(200)
})

it('should not be able to like themselves', async () => {
  const response = await request(app)
    .post('/users/' + currentUser.id + '/like')
    .set('Authorization', 'Bearer ' + currentUser.accessToken)

  expect(response.statusCode).toBe(409)
})

it('should be able to unlike a user', async () => {
  // delete query in db will not throw an error even though it won't be able to delete anything
  // because our logic defines that there cannot exist a like row with same receiver and senderid
  const response = await request(app)
    .delete('/users/' + currentUser.id + '/unlike')
    .set('Authorization', 'Bearer ' + currentUser.accessToken)

  expect(response.statusCode).toBe(204)
})

it('should list most liked-users', async () => {
  const response = await request(app).get('/most-liked?page=1&limit=10')

  expect(response.statusCode).toBe(200)
  expect(response.body.entries.length).toBeLessThanOrEqual(10)
})
