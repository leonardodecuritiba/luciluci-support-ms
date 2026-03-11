import { EntitySchema } from 'typeorm';

import Profile from '../../../entities/profile.entity';

const ProfileSchema = new EntitySchema<Profile>({
  name: 'Profile',
  target: Profile,
  tableName: 'profiles',
  columns: {
    id: {
      type: String,
      primary: true,
    },
    externalId: {
      name: 'external_id',
      type: String,
      unique: true,
    },
    displayName: {
      name: 'display_name',
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      nullable: true,
    },
    entityType: {
      name: 'entity_type',
      type: String,
    },
    status: {
      type: String,
    },
    country: {
      type: String,
      nullable: true,
    },
    city: {
      type: String,
      nullable: true,
    },
    classificationIdSnapshot: {
      name: 'classification_id_snapshot',
      type: String,
      nullable: true,
    },
    classificationNameSnapshot: {
      name: 'classification_name_snapshot',
      type: String,
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: Date,
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: Date,
      updateDate: true,
    },
  },
});

export default ProfileSchema;

