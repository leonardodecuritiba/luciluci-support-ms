import { IsUUID } from 'class-validator';

export default class UpdateMessageVisibilityPathDTO {
	@IsUUID('4')
	ticketId!: string;

	@IsUUID('4')
	messageId!: string;
}
