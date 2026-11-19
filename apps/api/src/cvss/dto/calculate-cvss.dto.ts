import { IsNotEmpty, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BountyPolicyOverrideDto {
  @IsOptional()
  min?: number;

  @IsOptional()
  max?: number;

  @IsOptional()
  @IsString()
  currency?: string;
}

export class CalculateCvssDto {
  @IsString()
  @IsNotEmpty({ message: 'CVSS vector string is required.' })
  @Matches(/^CVSS:3\.1\//, { message: "CVSS vector must start with 'CVSS:3.1/'" })
  vector!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BountyPolicyOverrideDto)
  policy?: BountyPolicyOverrideDto;
}
