import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseService } from '../database/database.service';
import * as jwt from 'jsonwebtoken';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import * as mail from './mail';

@Injectable({})
export class AuthService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(email, password) {
    try {
      const result = await this.database.findUser(email);
      if (!result) throw new ForbiddenException('User doesn`t exist');
      const pwMatches = await argon.verify(result.password, password);
      if (!pwMatches) throw new ForbiddenException('Password doesn`t match');

      const token = await this.signToken(result._id, result.email);

      return { token };
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
  async signup(email, password) {
    const transporter = nodemailer.createTransport(
      mail.config(this.config.get('META')),
    );
    try {
      const hashedPassword = await argon.hash(password);

      const verificationToken = uuidv4();
      const result = await this.database.createUser({
        email,
        password: hashedPassword,
        verificationToken,
      });
      if (!result) throw new ForbiddenException('Sorry, something went wrong');

      //set try block for the error occuring when the message wasn`t delivered
      try {
        await transporter.sendMail(mail.mail(verificationToken, email));
      } catch (error) {
        return { ...result, verificationLetter: error.message };
      }
      return result;
    } catch (e) {
      if (e.code === 11000) {
        console.log('An error');
        throw new ForbiddenException('Credentials are taken');
      }
      console.log(e);
    }
  }
  async signToken(userId: any, email: string): Promise<string> {
    const payload = { sub: userId, email };

    // const secret = this.config.get('SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '50m',
      secret: this.config.get('SECRET'),
    });
  }
  async verifyToken(token) {
    try {
      const user = await this.database.findByToken(token);
      if (!user) throw new ForbiddenException('User does not exist');
      await this.database.updateUser({
        id: user._id,
        info: { isVerified: true },
      });
      return 'Verification is successful';
    } catch (e) {
      throw new ForbiddenException('Verification is not successful');
    }
  }
  //This route is set for the case when the user couldn`t get verification letter and want it to be sent again
  async reverificate(email) {
    try {
      const user = await this.database.findByEmail(email);
      if (!user) throw new ForbiddenException('User does not exist');
      const verificationToken = uuidv4();
      const transporter = nodemailer.createTransport(
        mail.config(this.config.get('META')),
      );

      const result = await this.database.updateUser({
        id: user._id,
        info: { verificationToken },
      });
      if (!user) throw new ForbiddenException('Ooops! Something went wrong');
      try {
        await transporter.sendMail(mail.mail(verificationToken, email));
      } catch (error) {
        return { ...result, verificationLetter: error.message };
      }
      return result;
    } catch (e) {
      throw new ForbiddenException('Oops, something went wrong');
    }
  }
}
