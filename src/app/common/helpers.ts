import * as crypto from 'crypto'

export class Helpers {
  public static hashPassword(plainPassword: string): string {
    return crypto.createHash('sha256').update(plainPassword).digest('hex')
  }
}
