import Profile from '../../entities/profile.entity';
import EntityType from '../../entities/enums/entity-type.enum';
import ProfileStatus from '../../entities/enums/profile-status.enum';

export interface ListProfileFilters {
  status?: ProfileStatus;
  externalId?: string;
  classificationIdSnapshot?: string;
  displayName?: string;
  email?: string;
  entityType?: EntityType;
}

export default interface IProfileRepository {
  save(profile: Profile): Promise<Profile>;
  findByIdOrFail(id: string): Promise<Profile>;
  findByExternalIdOrFail(externalId: string): Promise<Profile>;
  findByExternalId(externalId: string): Promise<Profile | null>;
  findPaginated(
    page: number,
    limit: number,
    filters?: ListProfileFilters,
    sortBy?: string,
    order?: 'ASC' | 'DESC',
  ): Promise<[Profile[], number]>;
}

