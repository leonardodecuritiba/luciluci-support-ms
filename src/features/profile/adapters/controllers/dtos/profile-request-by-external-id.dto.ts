import { IsString, MaxLength } from 'class-validator';

export default class ProfileRequestByExternalIdDTO {
  @IsString()
  @MaxLength(120)
  externalId!: string;
}

