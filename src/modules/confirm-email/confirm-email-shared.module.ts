import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmEmail, ConfirmEmailSchema } from './confirm-email.schema';
import { ConfirmEmailService } from './confirm-email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forFeature([
      { name: ConfirmEmail.name, schema: ConfirmEmailSchema },
    ]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  providers: [ConfirmEmailService],
  exports: [ConfirmEmailService],
})
export class ConfirmEmailSharedModule {}
