import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public config: ConfigService, private database: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET'),
    });
  }
  async validate(payload: { sub: string; email: string }) {
    const requestedUser: { _id: any; email: string } =
      await this.database.findUserById(payload.sub);
    return requestedUser;
  }
}
