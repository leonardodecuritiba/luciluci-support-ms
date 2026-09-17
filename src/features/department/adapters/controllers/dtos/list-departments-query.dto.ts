import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

import DepartmentType from '../../../entities/enums/department-type.enum';

function toNumber(value: unknown): unknown {
	return typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
}

export default class ListDepartmentsQueryDTO {
	@IsOptional()
	@IsEnum(DepartmentType)
	type?: DepartmentType;

	@Transform(({ value }) => toNumber(value))
	@IsInt()
	@Min(1)
	page: number = 1;

	@Transform(({ value }) => toNumber(value))
	@IsInt()
	@Min(1)
	@Max(100)
	size: number = 20;
}
