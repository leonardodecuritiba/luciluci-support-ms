import { IsBoolean, IsDefined } from 'class-validator';

export default class UpdateMessageVisibilityRequestDTO {
	@IsDefined()
	@IsBoolean()
	isVisibleToRequester!: boolean;
}
