import { JWTInterceptor, JWTRequest } from '@/global/jwt/jwt.interceptor';
import { CommonResponse } from '@/util/api.response';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RedisService } from '../global/redis/redis.service';
import { CreateRoomDto } from './dto/request/create-room.dto';
import { ROOM_TYPE } from './entities/room.entity';
import { RoomService } from './room.service';
import { GetRoomListQueryDto } from './dto/request/room-list-query.dto';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    // private readonly chatBufferService: ChatBufferService
  ) {}

  @Get()
  async getRoomList(@Query() q: GetRoomListQueryDto) {
    const result = await this.redisService.getAllRoomInfo(q.type);
    return CommonResponse.ok('Room List', result);
  }

  @Get('/:id')
  async getRoomById(@Param('id') id: number) {
    const result = await this.redisService.getRoomById(id);
    return CommonResponse.ok('Room', result);
  }

  @Post('')
  @UseInterceptors(JWTInterceptor)
  async createRoom(
    @Req() req: JWTRequest,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    const { userId } = req;

    const room = await this.roomService.createRoom(userId, createRoomDto);
    return CommonResponse.ok('Success Create Room', room);
  }

  @Post('/join/:id')
  @UseInterceptors(JWTInterceptor)
  async joinRoom(@Req() req: JWTRequest, @Param('id') id: number) {
    const { userId } = req;

    await this.roomService.joinRoom(userId, id);
    return CommonResponse.ok('Join Room', null);
  }

  @Delete('/:id')
  @UseInterceptors(JWTInterceptor)
  async deleteRoom(@Req() req: JWTRequest, @Param('id') id: number) {
    const { userId } = req;
    const isAdmin = await this.authService.isAdmin(userId);
    if (!isAdmin) {
      throw new BadRequestException('Invalid User');
    }

    await this.roomService.deleteRoom(id);

    // TODO - 방에서 유저 나가게하기
    // TODO - 소켓 연결 끊기면 방폭파??

    if (process.env.INSTANCE_ID == 'chat-1') {
      // this.chatBufferService.clear(deleteRoomDto.roomId);
    }

    return CommonResponse.ok('Delete Room', null);
  }
}
