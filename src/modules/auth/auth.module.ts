import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthSharedModule } from './auth-shared.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmEmailSharedModule } from '../confirm-email/confirm-email-shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthSharedModule,
    ConfirmEmailSharedModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
})
export class AuthModule {}
