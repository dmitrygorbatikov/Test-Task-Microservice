import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUser, UpdateBody } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  public async findUserByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  public passwordHash(password): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public createUser(body: CreateUser) {
    const user = new this.userModel(body);
    return user.save();
  }

  public decodeToken(token: string) {
    return this.jwtService.verify(token);
  }

  public getUserProfile(id: number) {
    return this.userModel.findOne({ _id: id });
  }

  public updateUserData(_id: number, body: UpdateBody) {
    return this.userModel.findOneAndUpdate({ _id }, body);
  }
}
