import EntityType from './enums/entity-type.enum';
import ProfileStatus from './enums/profile-status.enum';

export default class Profile {
	id!: string;
	externalId!: string;
	displayName!: string;
	email!: string;
	phone?: string;
	entityType!: EntityType;
	status: ProfileStatus = ProfileStatus.Pending;
	country?: string;
	city?: string;
	classificationIdSnapshot?: string;
	classificationNameSnapshot?: string;
	createdAt!: Date;
	updatedAt!: Date;

	updateEditableFields(
		input: Partial<
			Pick<
				Profile,
				'displayName' | 'email' | 'phone' | 'entityType' | 'country' | 'city' | 'status'
			>
		>,
	): string[] {
		const changedFields: string[] = [];

		Object.entries(input).forEach(([field, value]) => {
			if (value === undefined) {
				return;
			}

			const currentValue = this[field as keyof Profile];

			if (currentValue !== value) {
				(this[field as keyof Profile] as unknown) = value;
				changedFields.push(field);
			}
		});

		return changedFields;
	}

	updateClassificationSnapshot(classificationId: string, classificationName: string): void {
		this.classificationIdSnapshot = classificationId;
		this.classificationNameSnapshot = classificationName;
	}
}
