import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcryptjs';
import { ConfirmEmailService } from '../confirm-email/confirm-email.service';
import {
  GetUserProfileResponse,
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  UpdateData,
} from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private confirmEmailService: ConfirmEmailService,
  ) {}

  @MessagePattern({ register: 'body' })
  async Register(data: RegisterData): Promise<RegisterResponse> {
    const candidate = await this.confirmEmailService.findConfirmEmail(
      data.email,
    );

    if (!candidate) {
      return {
        error: 'User not found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    const decodeData = await this.authService.decodeToken(candidate.code);

    const isSuccessful = decodeData.confirmCode === data.code ? true : false;

    if (isSuccessful === false) {
      return {
        error: 'Неверный код',
        status: HttpStatus.BAD_GATEWAY,
      };
    }
    const createdUser = await this.authService.createUser({
      name: decodeData.name,
      email: decodeData.email,
      password: decodeData.password,
    });

    const token = this.jwtService.sign({
      username: createdUser.name,
      userId: createdUser._id,
    });

    await this.confirmEmailService.deleteConfirmEmail(candidate.id);

    return {
      token,
      status: HttpStatus.OK,
    };
  }

  @MessagePattern({ login: 'body' })
  async Login(body: LoginData): Promise<LoginResponse> {
    const user = await this.authService.findUserByEmail(body.email);
    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }

    const isMatch = await bcrypt.compare(body.password, user.password);

    if (!isMatch) {
      return {
        error: 'Incorrect email or password',
        status: HttpStatus.BAD_GATEWAY,
      };
    }

    const token = this.jwtService.sign({
      username: user.name,
      userId: user._id,
    });
    return {
      token,
      status: HttpStatus.OK,
    };
  }

  @MessagePattern({ profile: 'body' })
  async getUserProfile(token: string): Promise<GetUserProfileResponse> {
    if (!token) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: 'UNAUTHORIZED',
      };
    }

    const userData = await this.authService.decodeToken(token);

    const user = await this.authService.getUserProfile(userData.userId);

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'User not found',
      };
    }

    return {
      data: user,
      status: HttpStatus.OK,
    };
  }

  @MessagePattern({ update: 'body' })
  async updateUserData(data: UpdateData) {
    if (!data.token) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: 'UNAUTHORIZED',
      };
    }

    const userData = await this.authService.decodeToken(data.token);

    await this.authService.updateUserData(userData.userId, data.body);

    return {
      status: HttpStatus.OK,
      message: 'UPDATED',
    };
  }
}
