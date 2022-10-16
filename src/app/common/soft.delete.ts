import { Column, Index } from 'typeorm'
import { Common } from './common'

export class SoftDelete extends Common {
  @Column('tinyint', {
    nullable: false,
    width: 1,
    default: () => "'0'",
  })
  @Index()
  public isDeleted: boolean
}
