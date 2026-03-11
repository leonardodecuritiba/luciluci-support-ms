import amqp, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

import logger from '../logger';
import { env } from '../../utils/env';

export interface PublishMessageInput {
	exchange: string;
	routingKey: string;
	payload: Record<string, unknown>;
	messageId: string;
	correlationId: string;
}

export default class RabbitMQService {
	private connection?: ChannelModel;
	private channel?: Channel;

	async connect(): Promise<void> {
		if (this.connection && this.channel) {
			return;
		}

		this.connection = await amqp.connect({
			hostname: env.rabbitmq.host,
			port: env.rabbitmq.port,
			username: env.rabbitmq.username,
			password: env.rabbitmq.password,
			vhost: env.rabbitmq.vhost,
			heartbeat: env.rabbitmq.heartbeat,
		});

		this.channel = await this.connection.createChannel();
		await this.channel.prefetch(env.consumer.prefetch);
		await this.assertInfrastructure();
		logger.info('RabbitMQ connected.');
	}

	async assertInfrastructure(): Promise<void> {
		const channel = this.getChannel();
		await channel.assertExchange(env.rabbitmq.profileExchange, 'topic', { durable: true });
		await channel.assertExchange(env.rabbitmq.classificationExchange, 'topic', {
			durable: true,
		});
	}

	async publish(input: PublishMessageInput): Promise<void> {
		const channel = this.getChannel();

		channel.publish(
			input.exchange,
			input.routingKey,
			Buffer.from(JSON.stringify(input.payload)),
			{
				persistent: true,
				messageId: input.messageId,
				correlationId: input.correlationId,
				contentType: 'application/json',
			},
		);
	}

	async consume(
		queue: string,
		exchange: string,
		routingKey: string,
		handler: (message: ConsumeMessage, channel: Channel) => Promise<void>,
	): Promise<void> {
		const channel = this.getChannel();
		await channel.assertExchange(exchange, 'topic', { durable: true });
		await channel.assertQueue(queue, { durable: true });
		await channel.bindQueue(queue, exchange, routingKey);

		await channel.consume(queue, async (message) => {
			if (!message) {
				return;
			}

			try {
				await handler(message, channel);
			} catch (error) {
				logger.error({ err: error, queue, routingKey }, 'RabbitMQ consumer failed.');
				channel.nack(message, false, false);
			}
		});
	}

	isHealthy(): boolean {
		return Boolean(this.connection && this.channel);
	}

	async close(): Promise<void> {
		if (this.channel) {
			await this.channel.close();
		}

		if (this.connection) {
			await this.connection.close();
		}
	}

	private getChannel(): Channel {
		if (!this.channel) {
			throw new Error('RabbitMQ channel not initialized.');
		}

		return this.channel;
	}
}
