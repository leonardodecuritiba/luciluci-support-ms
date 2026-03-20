import { randomUUID } from 'node:crypto';

import amqp, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

import { env } from '../../src/shared/utils/env';

export interface RabbitMqTestConsumer {
	waitForMessage(timeoutMs?: number): Promise<ConsumeMessage>;
	close(): Promise<void>;
}

export async function createRabbitMqTestConsumer(
	routingKey: string,
): Promise<RabbitMqTestConsumer> {
	let connection: ChannelModel | undefined;
	let channel: Channel | undefined;

	connection = await amqp.connect({
		hostname: env.rabbitmq.host,
		port: env.rabbitmq.port,
		username: env.rabbitmq.username,
		password: env.rabbitmq.password,
		vhost: env.rabbitmq.vhost,
		heartbeat: env.rabbitmq.heartbeat,
	});
	channel = await connection.createChannel();
	await channel.assertExchange(env.rabbitmq.profileExchange, 'topic', { durable: true });

	const queue = `products-ms-test-${randomUUID()}`;
	await channel.assertQueue(queue, {
		autoDelete: true,
		durable: false,
		exclusive: true,
	});
	await channel.bindQueue(queue, env.rabbitmq.profileExchange, routingKey);

	return {
		waitForMessage(timeoutMs = 5000) {
			return new Promise<ConsumeMessage>((resolve, reject) => {
				let consumerTag: string | undefined;

				const cleanup = () => {
					if (consumerTag && channel) {
						void channel.cancel(consumerTag).catch(() => undefined);
					}
				};

				const timeout = setTimeout(() => {
					cleanup();
					reject(
						new Error(
							`Timed out waiting for RabbitMQ message on routing key '${routingKey}'.`,
						),
					);
				}, timeoutMs);

				void channel!
					.consume(
						queue,
						(message) => {
							if (!message || !channel) {
								return;
							}

							clearTimeout(timeout);
							channel.ack(message);
							cleanup();
							resolve(message);
						},
						{ noAck: false },
					)
					.then((result) => {
						consumerTag = result.consumerTag;
					})
					.catch((error) => {
						clearTimeout(timeout);
						reject(error);
					});
			});
		},
		async close() {
			if (channel) {
				await channel.close().catch(() => undefined);
				channel = undefined;
			}

			if (connection) {
				await connection.close().catch(() => undefined);
				connection = undefined;
			}
		},
	};
}
