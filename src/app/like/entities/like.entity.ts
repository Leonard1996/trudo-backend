import { Column, Entity, ManyToOne, Unique } from 'typeorm'
import { Common } from '../../common/common'
import { User } from '../../user/entities/user.entity'

@Entity('likes')
@Unique(['receiver', 'sender'])
export class Like extends Common {
  @Column('int', {
    nullable: false,
  })
  public receiverId: number

  @Column('int', {
    nullable: false,
  })
  public senderId: number

  @ManyToOne(() => User, (user) => user.receivedLikes)
  receiver: User

  @ManyToOne(() => User, (user) => user.sentLikes)
  sender: User
}
