import { HttpStatus } from '@nestjs/common';
import { User } from '../user.schema';

export interface RegisterData {
  email: string;
  code: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  error?: string;
  status: HttpStatus;
  token?: string;
}

export interface LoginResponse {
  error?: string;
  status: HttpStatus;
  token?: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
}

export interface GetUserProfileResponse {
  data?: User;
  status: HttpStatus;
  error?: string;
}

export interface UpdateBody {
  name: string;
}

export interface UpdateData {
  token: string;
  body: UpdateBody;
}
