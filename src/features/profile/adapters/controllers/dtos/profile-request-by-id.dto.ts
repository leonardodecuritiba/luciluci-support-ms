import { IsUUID } from 'class-validator';

export default class ProfileRequestByIdDTO {
	@IsUUID()
	profileId!: string;
}
