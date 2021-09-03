import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfirmEmail, ConfirmEmailDocument } from './confirm-email.schema';
import { CreateConfirmEmail } from './types/confirm-email.types';

@Injectable()
export class ConfirmEmailService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(ConfirmEmail.name)
    private confirmEmailModel: Model<ConfirmEmailDocument>,
  ) {}

  public createCode(data: CreateConfirmEmail): string {
    return this.jwtService.sign({
      name: data.name,
      email: data.email,
      password: data.password,
      confirmCode: data.confirmCode,
    });
  }

  public createConfirmEmail(
    token: string,
    email: string,
  ): Promise<ConfirmEmail> {
    const confirmEmail = new this.confirmEmailModel({ code: token, email });
    return confirmEmail.save();
  }

  public async findConfirmEmail(email: string) {
    return this.confirmEmailModel.findOne({ email });
  }

  public async deleteConfirmEmail(id: number) {
    return this.confirmEmailModel.findOneAndDelete({ _id: id });
  }

  public getRandomNumber(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
