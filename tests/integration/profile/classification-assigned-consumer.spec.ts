import { ConsumeMessage } from 'amqplib';

import ClassificationAssignedConsumer from '../../../src/features/profile/adapters/consumers/classification-assigned.consumer';
import EntityType from '../../../src/features/profile/entities/enums/entity-type.enum';
import ProfileStatus from '../../../src/features/profile/entities/enums/profile-status.enum';
import Profile from '../../../src/features/profile/entities/profile.entity';
import ProcessedMessage from '../../../src/shared/entities/processed-message.entity';
import TestDataSource from '../../../src/shared/infrastructure/database/data-source-test';
import { clearDatabase, destroyTestDataSource, initializeTestDataSource } from '../../helpers/test-helpers';

describe('Integration: ClassificationAssignedConsumer', () => {
  beforeAll(async () => {
    await initializeTestDataSource();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await destroyTestDataSource();
  });

  it('updates snapshot once even if the same message is delivered twice', async () => {
    const repository = TestDataSource.getRepository(Profile);
    const consumer = new ClassificationAssignedConsumer(TestDataSource);
    const ack = jest.fn();
    const channel = { ack } as any;

    const profile = new Profile();
    profile.id = '4977ec7e-e506-44ca-b5ab-187e5cbbdbc4';
    profile.externalId = 'profile-001';
    profile.displayName = 'Alpha';
    profile.email = 'alpha@example.com';
    profile.entityType = EntityType.Individual;
    profile.status = ProfileStatus.Active;
    await repository.save(profile);

    const payload = {
      eventId: '34d5301f-f79f-4d89-a886-74156cb8de3c',
      correlationId: 'bfba9ba2-cb95-4936-b643-dfcfd11f460f',
      profileId: profile.id,
      classificationId: 'class-gold',
      classificationName: 'Gold',
      occurredAt: new Date().toISOString(),
    };

    const message = {
      content: Buffer.from(JSON.stringify(payload)),
      properties: {
        messageId: 'message-1',
        correlationId: payload.correlationId,
      },
    } as ConsumeMessage;

    await consumer.handle(message, channel);
    await consumer.handle(message, channel);

    const updated = await repository.findOneByOrFail({ id: profile.id });
    const processed = await TestDataSource.getRepository(ProcessedMessage).find();

    expect(updated.classificationIdSnapshot).toBe('class-gold');
    expect(updated.classificationNameSnapshot).toBe('Gold');
    expect(processed).toHaveLength(1);
    expect(ack).toHaveBeenCalledTimes(2);
  });
});

