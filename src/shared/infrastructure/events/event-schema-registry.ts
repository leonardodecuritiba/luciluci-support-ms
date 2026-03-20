import standardMsEventsSchema from '../../../../docs/asyncapi/v1/standard-ms-events.json';
import { ConsumedEventType, KnownEventType, PublishedEventType } from './event-types';

export interface EventSchemaInfo {
	eventType: KnownEventType;
	channel: string;
	exchange: string;
	routingKey: string;
	direction: 'published' | 'consumed';
	schema: Record<string, unknown>;
}

class EventSchemaRegistry {
	private readonly schemas = new Map<KnownEventType, EventSchemaInfo>();

	constructor() {
		// Local read-only registry derived from the checked-in AsyncAPI artifact.
		// This service does not integrate with an external schema registry in v1.
		this.registerPublished();
		this.registerConsumed();
	}

	private registerPublished(): void {
		const published: PublishedEventType[] = [
			'profiles.profile.created.v1',
			'profiles.profile.updated.v1',
		];

		published.forEach((eventType) => {
			const channel = standardMsEventsSchema.channels[eventType];
			const messageName = Object.keys(channel.messages)[0];
			const message = channel.messages[messageName as keyof typeof channel.messages] as {
				payload: Record<string, unknown>;
			};

			this.schemas.set(eventType, {
				eventType,
				channel: channel.address,
				exchange: 'profile.events',
				routingKey: eventType,
				direction: 'published',
				schema: message.payload,
			});
		});
	}

	private registerConsumed(): void {
		const consumed: ConsumedEventType[] = ['classifications.classification.assigned.v1'];

		consumed.forEach((eventType) => {
			const channel = standardMsEventsSchema.channels[eventType];
			const messageName = Object.keys(channel.messages)[0];
			const message = channel.messages[messageName as keyof typeof channel.messages] as {
				payload: Record<string, unknown>;
			};

			this.schemas.set(eventType, {
				eventType,
				channel: channel.address,
				exchange: 'classification.events',
				routingKey: eventType,
				direction: 'consumed',
				schema: message.payload,
			});
		});
	}

	getSchema(eventType: KnownEventType): EventSchemaInfo | undefined {
		return this.schemas.get(eventType);
	}

	getPublishedEvents(): EventSchemaInfo[] {
		return Array.from(this.schemas.values()).filter((item) => item.direction === 'published');
	}

	getConsumedEvents(): EventSchemaInfo[] {
		return Array.from(this.schemas.values()).filter((item) => item.direction === 'consumed');
	}
}

export const eventSchemaRegistry = new EventSchemaRegistry();
