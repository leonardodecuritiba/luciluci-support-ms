import { EntitySchema } from 'typeorm';

import TicketMessage from '../../../entities/ticket-message.entity';

const TicketMessageSchema = new EntitySchema<TicketMessage>({
	name: 'TicketMessage',
	target: TicketMessage,
	tableName: 'ticket_messages',
	columns: {
		id: { type: String, primary: true },
		ticketId: { name: 'ticket_id', type: String },
		message: { type: String },
		type: { type: String },
		authorId: { name: 'author_id', type: String },
		isVisibleToRequester: { name: 'is_visible_to_requester', type: Boolean },
		createdAt: { name: 'created_at', type: Date },
	},
	relations: {
		ticket: {
			type: 'many-to-one',
			target: 'Ticket',
			joinColumn: { name: 'ticket_id', referencedColumnName: 'id' },
			onDelete: 'CASCADE',
		},
	},
});

export default TicketMessageSchema;
