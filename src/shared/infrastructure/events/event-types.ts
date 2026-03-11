export const publishedEventTypes = [
	'profiles.profile.created.v1',
	'profiles.profile.updated.v1',
] as const;

export const consumedEventTypes = ['classifications.classification.assigned.v1'] as const;

export type PublishedEventType = (typeof publishedEventTypes)[number];
export type ConsumedEventType = (typeof consumedEventTypes)[number];
export type KnownEventType = PublishedEventType | ConsumedEventType;
