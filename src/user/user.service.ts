import { UserEntity } from '@/user/entities/user.entity';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserMapper } from './user.mapper';
import { UserResponseData } from './dto/response/user-response.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findById(userId: number): Promise<UserResponseData> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId
        }
      });

      if (!user) {
        throw new BadRequestException('Invalid User id');
      }

      return UserMapper.mapToResponseData(user);
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email
        }
      });

      return user ?? undefined;
    } catch (error) {
      this.logger.error(error);
      return undefined;
    }
  }

  async updateUser(userId:number, dto: UpdateUserDto, imagePath: string) {
    try {
      const whereCluase = {};

      if (dto.name && dto.name.trim() != '') whereCluase['name'] = dto.name;
      if (dto.description && dto.description.trim() != '') whereCluase['description'] = dto.description;
      if (dto.location && dto.location.trim() != '') whereCluase['location'] = dto.location;
      if (imagePath && imagePath.trim() != '') whereCluase['img_url'] = imagePath;

      const update = await this.dataSource.createQueryBuilder().update(UserEntity).set(whereCluase).where('id = :id', { id: userId }).execute();
      console.log(update)
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
