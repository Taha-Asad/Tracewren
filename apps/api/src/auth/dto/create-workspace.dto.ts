import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWorkspaceDto {
  @IsString({ message: 'Organization name must be a string.' })
  @MinLength(2, { message: 'Organization name must be at least 2 characters.' })
  @MaxLength(100, { message: 'Organization name cannot exceed 100 characters.' })
  @Transform(({ value, obj }) => (value || obj?.organizationName || '').trim())
  orgName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  organizationName?: string;

  @IsString({ message: 'Slug must be a string.' })
  @MinLength(2, { message: 'Slug must be at least 2 characters.' })
  @MaxLength(60, { message: 'Slug cannot exceed 60 characters.' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and single hyphens.',
  })
  @Transform(({ value, obj }) => (value || obj?.organizationSlug || '').toLowerCase().trim())
  slug!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  organizationSlug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  domain?: string;
}
