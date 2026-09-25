import {
	IsArray,
	IsBoolean,
	IsDefined,
	IsIn,
	IsString,
	Matches,
	ValidateIf,
} from 'class-validator';

export default class CreateTicketMessageRequestDTO {
	@IsString()
	@Matches(/\S/, { message: 'message must contain a non-whitespace character' })
	message!: string;

	@IsIn(['admin', 'backoffice', 'cd'])
	type!: 'admin' | 'backoffice' | 'cd';

	@IsString()
	@Matches(/\S/, { message: 'authorId must contain a non-whitespace character' })
	authorId!: string;

	@ValidateIf((_object, value) => value !== undefined)
	@IsArray()
	@IsString({ each: true })
	@Matches(/\S/, { each: true, message: 'each mediaIds item must be non-blank' })
	mediaIds?: string[];

	@IsDefined()
	@IsBoolean()
	isVisibleToRequester!: boolean;
}
