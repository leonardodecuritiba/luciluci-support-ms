import { IsArray, IsEnum, IsOptional, IsString, Matches } from 'class-validator';

import DepartmentType from '../../../entities/enums/department-type.enum';

export default class CreateDepartmentRequestDTO {
	@IsString()
	@Matches(/\S/, { message: 'name must contain a non-whitespace character' })
	name!: string;

	@IsEnum(DepartmentType)
	type!: DepartmentType;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Matches(/\S/, { each: true, message: 'each allowedUserIds item must be non-blank' })
	allowedUserIds?: string[];
}
