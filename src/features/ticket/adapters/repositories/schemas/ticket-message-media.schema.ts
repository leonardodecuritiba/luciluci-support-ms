import { EntitySchema } from 'typeorm';

import TicketMessageMedia from '../../../entities/ticket-message-media.entity';

const TicketMessageMediaSchema = new EntitySchema<TicketMessageMedia>({
	name: 'TicketMessageMedia',
	target: TicketMessageMedia,
	tableName: 'ticket_message_media',
	columns: {
		ticketMessageId: { name: 'ticket_message_id', type: String, primary: true },
		position: { type: Number, primary: true },
		mediaId: { name: 'media_id', type: String },
	},
	relations: {
		message: {
			type: 'many-to-one',
			target: 'TicketMessage',
			joinColumn: { name: 'ticket_message_id', referencedColumnName: 'id' },
			onDelete: 'CASCADE',
		},
	},
});

export default TicketMessageMediaSchema;
