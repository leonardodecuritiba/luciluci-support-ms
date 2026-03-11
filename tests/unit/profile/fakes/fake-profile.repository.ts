import NotFoundError from '../../../../src/shared/kernel/exceptions/not-found.error';
import Profile from '../../../../src/features/profile/entities/profile.entity';
import IProfileRepository, {
  ListProfileFilters,
} from '../../../../src/features/profile/use-cases/repositories/iprofile.repository';

export default class FakeProfileRepository implements IProfileRepository {
  items: Profile[] = [];

  async save(profile: Profile): Promise<Profile> {
    const existingIndex = this.items.findIndex((item) => item.id === profile.id);

    if (existingIndex >= 0) {
      profile.updatedAt = new Date();
      this.items[existingIndex] = profile;
      return profile;
    }

    profile.createdAt = new Date();
    profile.updatedAt = new Date();
    this.items.push(profile);
    return profile;
  }

  async findByIdOrFail(id: string): Promise<Profile> {
    const item = this.items.find((profile) => profile.id === id);

    if (!item) {
      throw new NotFoundError('PROFILE_NOT_FOUND', 'Profile not found.');
    }

    return item;
  }

  async findByExternalIdOrFail(externalId: string): Promise<Profile> {
    const item = this.items.find((profile) => profile.externalId === externalId);

    if (!item) {
      throw new NotFoundError('PROFILE_NOT_FOUND', 'Profile not found.');
    }

    return item;
  }

  async findByExternalId(externalId: string): Promise<Profile | null> {
    return this.items.find((profile) => profile.externalId === externalId) ?? null;
  }

  async findPaginated(
    page: number,
    limit: number,
    filters?: ListProfileFilters,
  ): Promise<[Profile[], number]> {
    let filtered = [...this.items];

    if (filters?.status) {
      filtered = filtered.filter((profile) => profile.status === filters.status);
    }

    if (filters?.externalId) {
      filtered = filtered.filter((profile) => profile.externalId === filters.externalId);
    }

    if (filters?.classificationIdSnapshot) {
      filtered = filtered.filter(
        (profile) =>
          profile.classificationIdSnapshot === filters.classificationIdSnapshot,
      );
    }

    if (filters?.displayName) {
      filtered = filtered.filter((profile) =>
        profile.displayName.toLowerCase().includes(filters.displayName!.toLowerCase()),
      );
    }

    if (filters?.email) {
      filtered = filtered.filter((profile) =>
        profile.email.toLowerCase().includes(filters.email!.toLowerCase()),
      );
    }

    if (filters?.entityType) {
      filtered = filtered.filter((profile) => profile.entityType === filters.entityType);
    }

    const start = (page - 1) * limit;
    return [filtered.slice(start, start + limit), filtered.length];
  }
}

