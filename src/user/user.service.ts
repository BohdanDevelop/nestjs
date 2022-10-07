import { Injectable, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as fs from 'fs';
import * as expressPath from 'path';
import * as argon from 'argon2';
import * as Jimp from 'jimp';

@Injectable({})
export class UserService {
  constructor(private database: DatabaseService) {}
  async changeSettings({ user, info }) {
    const { id } = user;
    if (info.password) {
      info.password = await argon.hash(info.password);
    }
    const changedUser = await this.database.updateUser({ id, info });
    return changedUser;
  }
  async addAvatar({ file, req }) {
    console.log(file);
    const publicPath = expressPath.join(
      __dirname,
      '..',
      '..',
      'public',
      'avatars',
    );

    const { path, filename } = file[0];
    const [extension] = filename.split('.').reverse();
    const newAvatar = `${req.user._id}.${extension}`;

    const midSizeAvatar = `${req.user._id}.mid.${extension}`;
    const minSizeAvatar = `${req.user._id}.min.${extension}`;

    const uploadDir = expressPath.join(publicPath, newAvatar);

    const midSizeUpload = expressPath.join(publicPath, midSizeAvatar);
    const minSizeUpload = expressPath.join(publicPath, minSizeAvatar);

    try {
      await fs.promises.rename(path, uploadDir);

      await fs.promises.copyFile(uploadDir, midSizeUpload);
      await fs.promises.copyFile(uploadDir, minSizeUpload);

      const normalImg = await Jimp.read(uploadDir);
      const normalWidth = normalImg.bitmap.width;
      const normalHeight = normalImg.bitmap.width;

      const midImg = await Jimp.read(midSizeUpload);
      const minImg = await Jimp.read(minSizeUpload);

      midImg.resize(normalWidth / 2, normalHeight / 2).write(midSizeUpload);
      minImg.resize(normalWidth / 4, normalHeight / 4).write(minSizeUpload);
      return await this.changeSettings({
        user: req.user,
        info: { avatar: newAvatar },
      });
    } catch (e) {
      await fs.promises.unlink(path);
    }
  }
}
