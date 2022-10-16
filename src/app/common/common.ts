import { Column, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm'
import { SoftDelete } from './soft.delete'

export class Common {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
  })
  public id: number

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  public tsCreated: Date

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  public tsLastModified: Date

  @BeforeUpdate()
  public addLastModified() {
    this.tsLastModified = new Date()
  }
}
