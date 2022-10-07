import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Error } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async createUser({ email, password, verificationToken }) {
    const newUser = new this.userModel({ email, password, verificationToken });
    const result = await newUser.save();
    return { id: result._id };
  }
  async findUser(email) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new ForbiddenException('The user with such an email doesn`t exist');
    return user;
  }
  async findUserById(id) {
    const user = await this.userModel.findById(id);
    user.password = undefined;
    return user;
  }
  async updateUser({ id, info }) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...info },
      { new: true },
    );
    user.password = undefined;
    return user;
  }
  async findByToken(token) {
    return await this.userModel.findOne({ verificationToken: token });
  }
  async findByEmail(email) {
    return await this.userModel.findOne({ email });
  }
}
