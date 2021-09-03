import { Controller, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../auth/auth.service';
import { ConfirmEmailService } from './confirm-email.service';
import * as nodemailer from 'nodemailer';
import {
  ConfirmEmailDate,
  ConfirmEmailResponse,
} from './types/confirm-email.types';

@Controller('confirm-email')
export class ConfirmEmailController {
  constructor(
    private authService: AuthService,
    private confirmEmailService: ConfirmEmailService,
  ) {}
  @MessagePattern({ confirmEmail: 'body' })
  async Register(body: ConfirmEmailDate): Promise<ConfirmEmailResponse> {
    const user = await this.authService.findUserByEmail(body.email);
    if (user) {
      return {
        status: HttpStatus.BAD_GATEWAY,
        error: 'User is exist',
      };
    }

    const candidateConfirmEmail =
      await this.confirmEmailService.findConfirmEmail(body.email);

    if (candidateConfirmEmail) {
      return {
        error: 'Вы уже отправляли письмо на почту',
        status: HttpStatus.BAD_GATEWAY,
      };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'hy6ikvto@gmail.com',
        pass: 'Z18SPXQtELHh',
      },
    });
    const rand = this.confirmEmailService.getRandomNumber(100000, 999999);

    const mailOptions = {
      from: 'hy6ikvto@gmail.com',
      to: body.email,
      subject: 'Подтверждение регистрации',
      text: `Ваш код подтверждения: ${rand}`,
    };

    transporter.sendMail(mailOptions);

    const hashedPassword = await this.authService.passwordHash(body.password);

    const confirmToken = await this.confirmEmailService.createCode({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      confirmCode: rand,
    });

    await this.confirmEmailService.createConfirmEmail(confirmToken, body.email);

    return {
      status: HttpStatus.OK,
      message: 'Письмо было отправлено',
    };
  }
}
