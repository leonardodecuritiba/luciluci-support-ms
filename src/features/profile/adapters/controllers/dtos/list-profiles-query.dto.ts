import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import EntityType from '../../../entities/enums/entity-type.enum';
import ProfileStatus from '../../../entities/enums/profile-status.enum';

/**
 * @openapi
 * components:
 *   schemas:
 *     ListProfilesResponse:
 *       type: object
 *       required: [data, pagination]
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProfileResponse'
 *         pagination:
 *           $ref: '#/components/schemas/Pagination'
 *     ProfileResponse:
 *       type: object
 *       required:
 *         - id
 *         - externalId
 *         - displayName
 *         - email
 *         - entityType
 *         - status
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         externalId:
 *           type: string
 *         displayName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         entityType:
 *           type: string
 *         status:
 *           type: string
 *         country:
 *           type: string
 *           nullable: true
 *         city:
 *           type: string
 *           nullable: true
 *         classificationIdSnapshot:
 *           type: string
 *           nullable: true
 *         classificationNameSnapshot:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export default class ListProfilesQueryDTO {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page = 1;

	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit = 10;

	@IsOptional()
	@IsEnum(ProfileStatus)
	status?: ProfileStatus;

	@IsOptional()
	@IsString()
	externalId?: string;

	@IsOptional()
	@IsString()
	classificationIdSnapshot?: string;

	@IsOptional()
	@IsString()
	displayName?: string;

	@IsOptional()
	@IsString()
	email?: string;

	@IsOptional()
	@IsEnum(EntityType)
	entityType?: EntityType;

	@IsOptional()
	@IsString()
	@Transform(({ value }) => String(value))
	sortBy?: string;

	@IsOptional()
	@Transform(({ value }) => String(value).toUpperCase())
	@IsEnum({ ASC: 'ASC', DESC: 'DESC' })
	order?: 'ASC' | 'DESC';
}
