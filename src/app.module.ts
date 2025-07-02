import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import ormConfig from './global/config/ormconfig';
import { QrModule } from './qr/qr.module';
import { UserEntity } from './user/entities/user.entity';
import { LoggerMiddleware } from './util/logger.middleware';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    UserModule,
    QrModule,
    RoomModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '/', method: RequestMethod.ALL }, { path: '*path', method: RequestMethod.ALL });
  }
}
