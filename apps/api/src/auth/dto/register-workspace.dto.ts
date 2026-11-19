import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterWorkspaceDto {
  @IsOptional()
  @IsString({ message: 'Organization name must be a string.' })
  @MinLength(2, { message: 'Organization name must be at least 2 characters.' })
  @MaxLength(100, { message: 'Organization name cannot exceed 100 characters.' })
  @Transform(({ value, obj }) => (value || obj.organizationName || '').trim())
  orgName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  organizationName?: string;

  @IsOptional()
  @IsString({ message: 'Slug must be a string.' })
  @MinLength(2, { message: 'Slug must be at least 2 characters.' })
  @MaxLength(60, { message: 'Slug cannot exceed 60 characters.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and single hyphens.',
  })
  @Transform(({ value, obj }) => (value || obj.organizationSlug || '').toLowerCase().trim())
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  organizationSlug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  domain?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  fullName?: string;

  @IsNotEmpty({ message: 'Work email is required.' })
  @IsEmail({}, { message: 'A valid email address is required.' })
  @MaxLength(320, { message: 'Email cannot exceed 320 characters.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  email!: string;

  @IsNotEmpty({ message: 'Master passphrase is required.' })
  @IsString()
  @MinLength(8, { message: 'Master passphrase must be at least 8 characters long.' })
  @MaxLength(128, { message: 'Master passphrase cannot exceed 128 characters.' })
  password!: string;

  @IsOptional()
  @IsString()
  recoveryPublicKey?: string;

  @IsOptional()
  @IsString()
  totpSecret?: string;

  @IsOptional()
  @IsString()
  totpCode?: string;

  @IsOptional()
  agreedToTerms?: boolean;
}
