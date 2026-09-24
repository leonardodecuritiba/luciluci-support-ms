import { IsUUID } from 'class-validator';

export default class UpdateTicketPathDTO {
	@IsUUID('4')
	ticketId!: string;
}
