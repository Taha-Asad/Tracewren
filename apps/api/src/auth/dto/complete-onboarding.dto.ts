import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CompleteOnboardingDto {
  @IsUUID('4', { message: 'Organization ID must be a valid UUIDv4.' })
  organizationId: string;

  @IsOptional()
  @IsString({ message: 'Domain must be a string.' })
  domain?: string;

  @IsOptional()
  @IsBoolean({ message: 'domainVerified must be a boolean.' })
  domainVerified?: boolean;
}
