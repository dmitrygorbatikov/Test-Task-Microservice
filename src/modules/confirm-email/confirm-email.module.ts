import { Module } from '@nestjs/common';
import { ConfirmEmailController } from './confirm-email.controller';
import { AuthSharedModule } from '../auth/auth-shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmEmail, ConfirmEmailSchema } from './confirm-email.schema';
import { ConfirmEmailSharedModule } from './confirm-email-shared.module';

@Module({
  controllers: [ConfirmEmailController],
  imports: [
    AuthSharedModule,
    ConfirmEmailSharedModule,
    MongooseModule.forFeature([
      { name: ConfirmEmail.name, schema: ConfirmEmailSchema },
    ]),
  ],
})
export class ConfirmEmailModule {}
