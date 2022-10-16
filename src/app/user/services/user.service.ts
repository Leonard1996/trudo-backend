import { Helpers } from '../../common/helpers'
import { getRepository } from 'typeorm'
import { UpdatePasswordDto } from '../dtos/update.password.dto'
import { User } from '../entities/user.entity'
import { Like } from '../../like/entities/like.entity'

export class UserService {
  public static getMe = (id: number) => {
    const userRepository = getRepository(User)

    return userRepository.findOne(id)
  }

  public static updatePassword = (
    id: number,
    { password, oldPassword }: UpdatePasswordDto
  ) => {
    const userRepository = getRepository(User)
    oldPassword = Helpers.hashPassword(oldPassword)
    password = Helpers.hashPassword(password)

    return userRepository.update({ id, password: oldPassword }, { password })
  }

  public static getById = (id: number) => {
    const userRepository = getRepository(User)
    return userRepository
      .createQueryBuilder('u')
      .loadRelationCountAndMap('u.likesCount', 'u.receivedLikes')
      .where('u.id = :id', { id: id })
      .getOne()
  }

  public static like = (receiverId: number, senderId: number) => {
    if (receiverId === senderId) throw new Error()
    const likeRepository = getRepository(Like)
    const like = likeRepository.create({ receiverId, senderId })
    return likeRepository.save(like)
  }

  public static unlike = (receiverId: number, senderId: number) => {
    const likeRepository = getRepository(Like)
    return likeRepository.delete({ receiverId, senderId })
  }

  public static getMostLiked = async ({
    page,
    limit,
  }: {
    page: number
    limit: number
  }) => {
    const userRepository = getRepository(User)
    const count = await userRepository.count()
    const entries = await userRepository
      .createQueryBuilder('u')
      .select('COUNT (l.id) as likes, u.*')
      .leftJoin('likes', 'l', 'l.receiverId = u.id')
      .orderBy('likes', 'DESC')
      .addOrderBy('u.id', 'DESC')
      .groupBy('u.id')
      .limit(+limit)
      .offset((+page - 1) * +limit)
      .getRawMany()

    return {
      count,
      entries,
    }
  }
}
