import Profile from '../entities/profile.entity';
import IProfileRepository from './repositories/iprofile.repository';

export interface FindProfileByExternalIdOutput {
  id: string;
  externalId: string;
  displayName: string;
  email: string;
  phone: string | null;
  entityType: string;
  status: string;
  country: string | null;
  city: string | null;
  classificationIdSnapshot: string | null;
  classificationNameSnapshot: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapProfile(profile: Profile): FindProfileByExternalIdOutput {
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

export default class FindProfileByExternalIdUseCase {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async execute(externalId: string): Promise<FindProfileByExternalIdOutput> {
    const profile = await this.profileRepository.findByExternalIdOrFail(externalId);
    return mapProfile(profile);
  }
}

