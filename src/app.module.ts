import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// const DB_HOST =
//   'mongodb+srv://radchuk_you:eqJuWgIiOszff0BD@cluster0.d6v3m.mongodb.net/db-nest?retryWrites=true&w=majority';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MulterModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    BookmarkModule,
    MongooseModule.forRootAsync({
      useFactory: () => {
        console.log();
        return { uri: process.env.DB_HOST };
      },
    }),
    MongooseModule,
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
