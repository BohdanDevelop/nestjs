import {
  Controller,
  Get,
  UseGuards,
  Req,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { stringify } from 'querystring';
import { SettingDto } from './dto';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import * as nodemailer from 'nodemailer';

interface IuserId extends Request {
  user: {
    _id: any;
  };
}
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('me/settings')
  async setMe(@Req() req: Request, @Body() dto: SettingDto) {
    return await this.userService.changeSettings({
      user: req.user,
      info: dto,
    });
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('me/avatar')
  @UseInterceptors(
    FilesInterceptor('image', 1, {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async addAvatar(@UploadedFiles() file, @Req() req: IuserId) {
    return await this.userService.addAvatar({ file, req });
  }
}
