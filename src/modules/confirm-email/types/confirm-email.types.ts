import { HttpStatus } from '@nestjs/common';

export interface CreateConfirmEmail {
  name: string;
  email: string;
  password: string;
  confirmCode: number;
}

export interface ConfirmEmailDate {
  name: string;
  email: string;
  password: string;
}

export interface ConfirmEmailResponse {
  error?: string;
  status: HttpStatus;
  token?: string;
  message?: string;
}
