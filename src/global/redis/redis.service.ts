import { RoomResponse } from '@/room/dto/response/room-response.dto';
import { ROOM_TYPE, RoomEntity } from '@/room/entities/room.entity';
import { RoomMapper } from '@/room/room.mapper';
import {
  BadRequestException,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private publisher: RedisClient; // Sender
  private subscriber: RedisClient; // Receiver

  constructor() {}

  async onModuleInit() {
    this.publisher = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    this.subscriber = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    await Promise.all([
      new Promise<void>((resolve) => this.publisher.once('ready', resolve)),
      new Promise<void>((resolve) => this.subscriber.once('ready', resolve)),
    ]);
  }

  publish(channel: string, message: string) {
    return this.publisher.publish(channel, message);
  }

  subscribe(channel: string, callback: (message: string) => void) {
    if (!this.subscriber) {
      throw new Error('Redis subscriber is not initialized yet.');
    }

    this.subscriber.subscribe(channel, (err, count) => {
      if (err) {
        throw new Error(
          `Failed to subscribe to channel ${channel}: ${err.message}`,
        );
      }
    });

    this.subscriber.on('message', (ch, message) => {
      if (ch === channel) {
        callback(message);
      }
    });
  }

  async sadd(key: string, data: string): Promise<number> {
    return this.publisher.sadd(key, data);
  }

  async scard(key: string): Promise<number> {
    return this.publisher.scard(key);
  }

  async srem(key: string, data: string) {
    return this.publisher.srem(key, data);
  }

  async createRoom(room: RoomEntity) {
    await this.publisher.hset(
      `room:${room.type.toLowerCase()}:${room.id}`,
      room,
    );
    await this.publisher.sadd(
      `room:${room.type.toLowerCase()}:${room.id}:users`,
      1,
    );
  }

  async joinRoom(room: RoomResponse, userId: number) {
    await this.publisher.hset(`room:${room.type}:${room.id}`, {
      joined_user_id: userId,
      joined_at: new Date().toISOString(),
    });

    await this.publisher.sadd(`room:${room.type}:${room.id}:users`, 2);
  }

  async deleteRoom(roomId: number) {
    const keys = await this.publisher.keys(`room:*:${roomId}*`);
    await this.publisher.del(...keys);
  }

  async getAllRoomInfo(type: ROOM_TYPE): Promise<Array<RoomResponse>> {
    const allRooms = type
      ? await this.publisher.keys(`room:${type.toLowerCase()}:*`)
      : await this.publisher.keys('room:*:*');
    const rooms = allRooms.filter((room) => room.split(':').length == 3);

    const results = await Promise.all(
      rooms.map(async (room) => {
        const info = await this.publisher.hgetall(room);
        const mappedRoom = RoomMapper.mapToEntityByRedis(info);

        const userCount = await this.publisher.scard(
          `room:${mappedRoom.type.toLowerCase()}:${mappedRoom.id}:users`,
        );

        return RoomMapper.mapToResponse(mappedRoom, userCount);
      }),
    );

    return results;
  }

  async getRoomById(roomId: number): Promise<RoomResponse> {
    const keys = await this.publisher.keys(`room:*:${roomId}`);
    const roomKey = keys.find((key) => !key.endsWith(':users'));
    const room = await this.publisher.hgetall(roomKey);
    if (!room || Object.keys(room).length == 0) {
      throw new BadRequestException('Invalid Room');
    }
    return RoomMapper.mapToResponse(RoomMapper.mapToEntityByRedis(room));
  }

  onModuleDestroy() {
    this.publisher?.disconnect();
    this.subscriber?.disconnect();
  }
}
