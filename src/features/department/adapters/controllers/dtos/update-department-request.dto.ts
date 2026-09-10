import { IsArray, IsEnum, IsString, Matches, ValidateIf } from 'class-validator';

import DepartmentType from '../../../entities/enums/department-type.enum';

export default class UpdateDepartmentRequestDTO {
	@ValidateIf((_object, value) => value !== undefined)
	@IsString()
	@Matches(/\S/, { message: 'name must contain a non-whitespace character' })
	name?: string;

	@ValidateIf((_object, value) => value !== undefined)
	@IsEnum(DepartmentType)
	type?: DepartmentType;

	@ValidateIf((_object, value) => value !== undefined)
	@IsArray()
	@IsString({ each: true })
	@Matches(/\S/, { each: true, message: 'each allowedUserIds item must be non-blank' })
	allowedUserIds?: string[];
}
