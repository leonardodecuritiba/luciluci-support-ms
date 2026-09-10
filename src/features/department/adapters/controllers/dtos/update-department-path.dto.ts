import { IsUUID } from 'class-validator';

export default class UpdateDepartmentPathDTO {
	@IsUUID('4')
	departmentId!: string;
}
