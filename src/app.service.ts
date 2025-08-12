import { Injectable } from '@nestjs/common';
import { ConnectionService } from './common/database/connection.service';
import { ConfigService } from '@nestjs/config';
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly configService: ConfigService
  ) {}
  async getHello(): Promise<User[]> {
    await this.connectionService.init(
      this.configService.get<string>('DB_HOST'),
      this.configService.get<string>('DB_USER'),
      this.configService.get<string>('DB_PASS'),
      this.configService.get<string>('DB_DATABASE'),
      this.configService.get<number>('DB_PORT')
    );
    try {
      const conn = this.connectionService.getConnection();
      const [rows] = await conn.query<User[]>('SELECT * FROM USER');
      return rows;
    } catch (error) {
      console.error((error as Error).message);
      throw new Error(error);
    } finally {
      await this.connectionService.close();
    }
  }
}
