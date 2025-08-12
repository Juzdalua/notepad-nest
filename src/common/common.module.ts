import { Module } from '@nestjs/common';
import { ConnectionService } from './database/connection.service';

@Module({
  providers: [ConnectionService],
  exports: [ConnectionService]
})
export class CommonModule {}
