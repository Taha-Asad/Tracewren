import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail({}, { message: 'A valid email address is required.' })
  @MaxLength(320, { message: 'Email cannot exceed 320 characters.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  email!: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString()
  @MaxLength(128, { message: 'Password cannot exceed 128 characters.' })
  password!: string;

  @IsOptional()
  @IsNumberString({}, { message: 'TOTP code must consist of numeric digits only.' })
  @Length(6, 6, { message: 'TOTP code must be exactly 6 digits.' })
  totpCode?: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;

  @IsOptional()
  @IsString()
  accountType?: 'defender' | 'hunter';
}
