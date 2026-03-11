import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

import AuditLogTypeormRepository from '../../../../shared/adapters/repositories/audit-log-typeorm.repository';
import OutboxEventTypeormRepository from '../../../../shared/adapters/repositories/outbox-event-typeorm.repository';
import IdempotencyService from '../../../../shared/services/idempotency.service';
import { validateDto } from '../../../../shared/kernel/validation/validate-dto';
import ProfileTypeormRepository from '../repositories/profile-typeorm.repository';
import CreateProfileRequestDTO from './dtos/create-profile-request.dto';
import ListProfilesQueryDTO from './dtos/list-profiles-query.dto';
import ProfileRequestByExternalIdDTO from './dtos/profile-request-by-external-id.dto';
import ProfileRequestByIdDTO from './dtos/profile-request-by-id.dto';
import UpdateProfileRequestDTO from './dtos/update-profile-request.dto';
import CreateProfileUseCase from '../../use-cases/create-profile.use-case';
import FindProfileByExternalIdUseCase from '../../use-cases/find-profile-by-external-id.use-case';
import ListProfilesUseCase from '../../use-cases/list-profiles.use-case';
import UpdateProfileUseCase from '../../use-cases/update-profile.use-case';

function actionContext(req: Request) {
  return {
    correlationId: req.correlationId,
    performedBy: req.performedBy,
    performedByType: req.performedByType,
  };
}

export default function buildProfileController(dataSource: DataSource) {
  const idempotencyService = new IdempotencyService(dataSource);

  return {
    create: async (req: Request, res: Response): Promise<void> => {
      const payload = await validateDto(CreateProfileRequestDTO, req.body);

      const response = await dataSource.transaction(async (manager) => {
        const useCase = new CreateProfileUseCase(
          new ProfileTypeormRepository(manager),
          new OutboxEventTypeormRepository(manager),
          new AuditLogTypeormRepository(manager),
        );

        return useCase.execute(payload, actionContext(req));
      });

      await idempotencyService.completeRequest(res.locals.idempotencyContext, 201, response);
      res.status(201).json(response);
    },

    update: async (req: Request, res: Response): Promise<void> => {
      const params = await validateDto(ProfileRequestByIdDTO, req.params);
      const payload = await validateDto(UpdateProfileRequestDTO, req.body);

      const response = await dataSource.transaction(async (manager) => {
        const useCase = new UpdateProfileUseCase(
          new ProfileTypeormRepository(manager),
          new OutboxEventTypeormRepository(manager),
          new AuditLogTypeormRepository(manager),
        );

        return useCase.execute(params.profileId, payload, actionContext(req));
      });

      await idempotencyService.completeRequest(res.locals.idempotencyContext, 200, response);
      res.status(200).json(response);
    },

    list: async (req: Request, res: Response): Promise<void> => {
      const query = await validateDto(ListProfilesQueryDTO, req.query);
      const useCase = new ListProfilesUseCase(new ProfileTypeormRepository(dataSource.manager));
      const response = await useCase.execute(query);

      res.status(200).json(response);
    },

    findByExternalId: async (req: Request, res: Response): Promise<void> => {
      const params = await validateDto(ProfileRequestByExternalIdDTO, req.params);
      const useCase = new FindProfileByExternalIdUseCase(
        new ProfileTypeormRepository(dataSource.manager),
      );

      const response = await useCase.execute(params.externalId);
      res.status(200).json(response);
    },
  };
}
