import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class VerifyDomainDto {
  @IsUUID('4', { message: 'Organization ID must be a valid UUIDv4.' })
  organizationId: string;

  @IsString({ message: 'Domain must be a string.' })
  @IsNotEmpty({ message: 'Domain is required.' })
  domain: string;
}
