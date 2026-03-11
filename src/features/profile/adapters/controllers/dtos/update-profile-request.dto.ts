import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

import EntityType from '../../../entities/enums/entity-type.enum';
import ProfileStatus from '../../../entities/enums/profile-status.enum';

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateProfileRequestDTO:
 *       type: object
 *       properties:
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
export default class UpdateProfileRequestDTO {
	@IsOptional()
	@IsString()
	@MaxLength(255)
	displayName?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	phone?: string;

	@IsOptional()
	@IsEnum(EntityType)
	entityType?: EntityType;

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
