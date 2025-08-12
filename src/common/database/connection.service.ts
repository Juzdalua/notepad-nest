import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

export interface ConnectionOptions {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

@Injectable()
export class ConnectionService {
  private connection: mysql.Connection;

  constructor() {}

  public async init(host: string, user: string, password: string, database: string, port: number) {
    try {
      this.connection = await mysql.createConnection({
        host,
        user,
        password,
        database,
        port
      });
      return true;
    } catch (error) {
      console.error((error as Error).message);
      return false;
    }
  }

  public getConnection(): mysql.Connection {
    if (!this.connection) {
      throw new Error('connection not exist');
    }
    return this.connection;
  }

  public async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}
