import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import EntityType from '../../../entities/enums/entity-type.enum';
import ProfileStatus from '../../../entities/enums/profile-status.enum';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProfileRequestDTO:
 *       type: object
 *       required: [externalId, displayName, email, entityType]
 *       properties:
 *         externalId:
 *           type: string
 *         displayName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         entityType:
 *           type: string
 *           enum: [individual, organization]
 *         country:
 *           type: string
 *         city:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, active, inactive, blocked]
 */
export default class CreateProfileRequestDTO {
  @IsString()
  @MaxLength(120)
  externalId!: string;

  @IsString()
  @MaxLength(255)
  displayName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @IsEnum(EntityType)
  entityType!: EntityType;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @IsOptional()
  @IsEnum(ProfileStatus)
  status?: ProfileStatus;
}

