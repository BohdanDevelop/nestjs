import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from 'src/database/database.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [DatabaseModule, MulterModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
