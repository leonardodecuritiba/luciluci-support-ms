import { IsUUID } from 'class-validator';

export default class DeleteDepartmentPathDTO {
	@IsUUID('4')
	departmentId!: string;
}
