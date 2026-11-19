import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';
import { OperationalLabel } from '@prisma/client';

export class SubmitReportDto {
  @IsUUID('4', { message: 'organizationId must be a valid UUIDv4' })
  @IsNotEmpty()
  organizationId!: string;

  @IsUUID('4', { message: 'programId must be a valid UUIDv4' })
  @IsNotEmpty()
  programId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  assetScope!: string;

  @IsEnum(OperationalLabel, {
    message: 'operationalLabel must be a valid classification (e.g. REMOTE_CODE_EXECUTION, AUTHENTICATION_BYPASS)',
  })
  operationalLabel!: OperationalLabel;

  @IsString()
  @IsNotEmpty()
  titleCiphertext!: string;

  @IsString()
  @IsNotEmpty()
  encryptedPayload!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-fA-F0-9]{64}$/, {
    message: 'payloadBodySha256 must be a 64-character hexadecimal SHA-256 string',
  })
  payloadBodySha256!: string;

  @IsOptional()
  @IsString()
  @Matches(/^CVSS:3\.1\//, { message: "cvssVector must start with 'CVSS:3.1/'" })
  cvssVector?: string;

  @IsOptional()
  @IsUUID('4')
  hunterId?: string;

  @IsOptional()
  @IsUUID('4')
  guestActorId?: string;
}
