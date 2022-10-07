import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
