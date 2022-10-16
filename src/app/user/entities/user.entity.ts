import { SoftDelete } from '../../common/soft.delete'
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm'
import { Like } from '../../like/entities/like.entity'

@Entity('users')
@Unique(['username'])
export class User extends SoftDelete {
  @Column('varchar', {
    nullable: false,
    length: 256,
    select: false,
  })
  public password: string

  @Column('varchar', {
    nullable: false,
    length: 256,
  })
  public username: string

  @OneToMany(() => Like, (like) => like.receiver)
  receivedLikes: Like[]

  @OneToMany(() => Like, (like) => like.sender)
  sentLikes: Like[]
}
