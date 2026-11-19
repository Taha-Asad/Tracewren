import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendInvitationDto {
  @IsNotEmpty({ message: 'Invitee email address is required.' })
  @IsEmail({}, { message: 'A valid email address is required.' })
  email!: string;

  @IsNotEmpty({ message: 'Role is required.' })
  @IsString()
  role!: string;

  @IsNotEmpty({ message: 'Program name is required.' })
  @IsString()
  programName!: string;

  @IsOptional()
  @IsString()
  programSlug?: string;

  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  inviterName?: string;

  @IsOptional()
  @IsString()
  inviterEmail?: string;
}
