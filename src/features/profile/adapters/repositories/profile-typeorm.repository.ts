import { EntityManager, Repository } from 'typeorm';

import NotFoundError from '../../../../shared/kernel/exceptions/not-found.error';
import Profile from '../../entities/profile.entity';
import IProfileRepository, { ListProfileFilters } from '../../use-cases/repositories/iprofile.repository';

export default class ProfileTypeormRepository implements IProfileRepository {
  private readonly repository: Repository<Profile>;

  constructor(managerOrRepository: EntityManager | Repository<Profile>) {
    this.repository =
      managerOrRepository instanceof Repository
        ? managerOrRepository
        : managerOrRepository.getRepository(Profile);
  }

  save(profile: Profile): Promise<Profile> {
    return this.repository.save(profile);
  }

  async findByIdOrFail(id: string): Promise<Profile> {
    const profile = await this.repository.findOneBy({ id });

    if (!profile) {
      throw new NotFoundError('PROFILE_NOT_FOUND', 'Profile not found.');
    }

    return profile;
  }

  async findByExternalIdOrFail(externalId: string): Promise<Profile> {
    const profile = await this.repository.findOneBy({ externalId });

    if (!profile) {
      throw new NotFoundError('PROFILE_NOT_FOUND', 'Profile not found.');
    }

    return profile;
  }

  findByExternalId(externalId: string): Promise<Profile | null> {
    return this.repository.findOneBy({ externalId });
  }

  async findPaginated(
    page: number,
    limit: number,
    filters?: ListProfileFilters,
    sortBy = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ): Promise<[Profile[], number]> {
    const allowedSorts = new Set([
      'createdAt',
      'updatedAt',
      'displayName',
      'email',
      'status',
    ]);
    const resolvedSort = allowedSorts.has(sortBy) ? sortBy : 'createdAt';

    const query = this.repository.createQueryBuilder('profile');

    if (filters?.status) {
      query.andWhere('profile.status = :status', { status: filters.status });
    }

    if (filters?.externalId) {
      query.andWhere('profile.externalId = :externalId', {
        externalId: filters.externalId,
      });
    }

    if (filters?.classificationIdSnapshot) {
      query.andWhere('profile.classificationIdSnapshot = :classificationIdSnapshot', {
        classificationIdSnapshot: filters.classificationIdSnapshot,
      });
    }

    if (filters?.displayName) {
      query.andWhere('LOWER(profile.displayName) LIKE :displayName', {
        displayName: `%${filters.displayName.toLowerCase()}%`,
      });
    }

    if (filters?.email) {
      query.andWhere('LOWER(profile.email) LIKE :email', {
        email: `%${filters.email.toLowerCase()}%`,
      });
    }

    if (filters?.entityType) {
      query.andWhere('profile.entityType = :entityType', {
        entityType: filters.entityType,
      });
    }

    query.orderBy(`profile.${resolvedSort}`, order);
    query.skip((page - 1) * limit);
    query.take(limit);

    return query.getManyAndCount();
  }
}

