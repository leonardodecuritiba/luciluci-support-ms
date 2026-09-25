import {
	IsArray,
	IsBoolean,
	IsDefined,
	IsIn,
	IsOptional,
	IsString,
	Matches,
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

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Matches(/\S/, { each: true, message: 'each mediaIds item must be non-blank' })
	mediaIds?: string[];

	@IsDefined()
	@IsBoolean()
	isVisibleToRequester!: boolean;
}
