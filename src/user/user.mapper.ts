import { UserEntity } from '@/user/entities/user.entity';
import { UserResponseData } from './dto/response/user-response.dto';

export class UserMapper {
  public static mapToResponseData(userEntity: UserEntity): UserResponseData | undefined {
    return {
      id: userEntity.id,
      name: userEntity.name,
      nickname: userEntity.nickname,
      role: userEntity.role,
      description: userEntity.description,
      imgUrl: userEntity.img_url,
      location: userEntity.location,
      status: userEntity.status,
      createdAt: userEntity.created_at
    };
  }
}
