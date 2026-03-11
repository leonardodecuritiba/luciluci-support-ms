import EntityType from '../entities/enums/entity-type.enum';
import ProfileStatus from '../entities/enums/profile-status.enum';
import Profile from '../entities/profile.entity';
import IProfileRepository from './repositories/iprofile.repository';

export interface ListProfilesInput {
  page: number;
  limit: number;
  status?: ProfileStatus;
  externalId?: string;
  classificationIdSnapshot?: string;
  displayName?: string;
  email?: string;
  entityType?: EntityType;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export interface ListProfilesOutput {
  data: Array<Record<string, unknown>>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function mapProfile(profile: Profile): Record<string, unknown> {
  return {
    id: profile.id,
    externalId: profile.externalId,
    displayName: profile.displayName,
    email: profile.email,
    phone: profile.phone ?? null,
    entityType: profile.entityType,
    status: profile.status,
    country: profile.country ?? null,
    city: profile.city ?? null,
    classificationIdSnapshot: profile.classificationIdSnapshot ?? null,
    classificationNameSnapshot: profile.classificationNameSnapshot ?? null,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export default class ListProfilesUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(input: ListProfilesInput): Promise<ListProfilesOutput> {
    const [profiles, total] = await this.profileRepository.findPaginated(
      input.page,
      input.limit,
      {
        status: input.status,
        externalId: input.externalId,
        classificationIdSnapshot: input.classificationIdSnapshot,
        displayName: input.displayName,
        email: input.email,
        entityType: input.entityType,
      },
      input.sortBy,
      input.order,
    );

    return {
      data: profiles.map(mapProfile),
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: Math.ceil(total / input.limit) || 1,
      },
    };
  }
}

