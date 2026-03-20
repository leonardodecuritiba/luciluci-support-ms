const fs = require('node:fs');

function readJson(filePath) {
	return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getFirstMessagePayload(channel, channelName) {
	if (!channel || typeof channel !== 'object' || !channel.messages) {
		throw new Error(`Channel '${channelName}' does not expose any messages.`);
	}

	const message = Object.values(channel.messages)[0];

	if (!message || typeof message !== 'object' || !message.payload) {
		throw new Error(`Channel '${channelName}' does not expose a payload schema.`);
	}

	return message.payload;
}

function normalizeTypes(typeValue) {
	if (!typeValue) {
		return [];
	}

	return Array.isArray(typeValue) ? typeValue : [typeValue];
}

function compareSchemas(baselineSchema, candidateSchema, path, errors) {
	if (!baselineSchema || typeof baselineSchema !== 'object') {
		return;
	}

	if (!candidateSchema || typeof candidateSchema !== 'object') {
		errors.push(`${path}: candidate schema is missing.`);
		return;
	}

	const baselineTypes = normalizeTypes(baselineSchema.type);
	const candidateTypes = normalizeTypes(candidateSchema.type);
	const incompatibleTypes = candidateTypes.filter(
		(typeName) => !baselineTypes.includes(typeName),
	);

	if (baselineTypes.length > 0 && (candidateTypes.length === 0 || incompatibleTypes.length > 0)) {
		errors.push(
			`${path}: type changed from '${baselineTypes.join('|')}' to '${candidateTypes.join('|') || 'undefined'}'.`,
		);
		return;
	}

	if (baselineSchema.format && candidateSchema.format !== baselineSchema.format) {
		errors.push(
			`${path}: format changed from '${baselineSchema.format}' to '${candidateSchema.format ?? 'undefined'}'.`,
		);
	}

	if (
		Object.prototype.hasOwnProperty.call(baselineSchema, 'const') &&
		candidateSchema.const !== baselineSchema.const
	) {
		errors.push(
			`${path}: const changed from '${baselineSchema.const}' to '${candidateSchema.const}'.`,
		);
	}

	if (Array.isArray(baselineSchema.enum)) {
		if (Object.prototype.hasOwnProperty.call(candidateSchema, 'const')) {
			if (!baselineSchema.enum.includes(candidateSchema.const)) {
				errors.push(
					`${path}: const '${candidateSchema.const}' is not compatible with baseline enum [${baselineSchema.enum.join(', ')}].`,
				);
			}
		} else if (Array.isArray(candidateSchema.enum)) {
			const incompatibleValues = candidateSchema.enum.filter(
				(value) => !baselineSchema.enum.includes(value),
			);

			if (incompatibleValues.length > 0) {
				errors.push(
					`${path}: enum added incompatible values [${incompatibleValues.join(', ')}].`,
				);
			}
		} else {
			errors.push(`${path}: candidate enum is missing.`);
		}
	}

	if (baselineTypes.includes('object')) {
		const baselineProperties = baselineSchema.properties ?? {};
		const candidateProperties = candidateSchema.properties ?? {};
		const baselineRequired = new Set(baselineSchema.required ?? []);
		const candidateRequired = new Set(candidateSchema.required ?? []);

		for (const propertyName of Object.keys(baselineProperties)) {
			if (!Object.prototype.hasOwnProperty.call(candidateProperties, propertyName)) {
				errors.push(`${path}: property '${propertyName}' was removed.`);
				continue;
			}

			compareSchemas(
				baselineProperties[propertyName],
				candidateProperties[propertyName],
				`${path}.${propertyName}`,
				errors,
			);
		}

		for (const requiredName of baselineRequired) {
			if (!candidateRequired.has(requiredName)) {
				errors.push(
					`${path}: required property '${requiredName}' became optional or was removed.`,
				);
			}
		}

		return;
	}

	if (baselineTypes.includes('array') && baselineSchema.items) {
		if (!candidateSchema.items) {
			errors.push(`${path}: array item schema is missing.`);
			return;
		}

		compareSchemas(baselineSchema.items, candidateSchema.items, `${path}[]`, errors);
	}
}

function checkAsyncApiBackwardCompatibility(baselineSpec, candidateSpec) {
	const errors = [];
	const baselineChannels = baselineSpec.channels ?? {};
	const candidateChannels = candidateSpec.channels ?? {};

	for (const [channelName, baselineChannel] of Object.entries(baselineChannels)) {
		const candidateChannel = candidateChannels[channelName];

		if (!candidateChannel) {
			errors.push(`Channel '${channelName}' was removed from the candidate contract.`);
			continue;
		}

		if (baselineChannel.address && candidateChannel.address !== baselineChannel.address) {
			errors.push(
				`Channel '${channelName}' changed address from '${baselineChannel.address}' to '${candidateChannel.address}'.`,
			);
		}

		const baselinePayload = getFirstMessagePayload(baselineChannel, channelName);
		const candidatePayload = getFirstMessagePayload(candidateChannel, channelName);

		compareSchemas(
			baselinePayload,
			candidatePayload,
			`channels.${channelName}.payload`,
			errors,
		);
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

function main() {
	const [baselinePath, candidatePath] = process.argv.slice(2);

	if (!baselinePath || !candidatePath) {
		console.error(
			'Usage: node scripts/check-asyncapi-backward-compatibility.js <baseline.json> <candidate.json>',
		);
		process.exit(1);
	}

	const baselineSpec = readJson(baselinePath);
	const candidateSpec = readJson(candidatePath);
	const result = checkAsyncApiBackwardCompatibility(baselineSpec, candidateSpec);

	if (!result.valid) {
		console.error('AsyncAPI backward compatibility check failed:');
		for (const error of result.errors) {
			console.error(`- ${error}`);
		}
		process.exit(1);
	}

	console.log('AsyncAPI backward compatibility OK');
}

if (require.main === module) {
	main();
}

module.exports = {
	checkAsyncApiBackwardCompatibility,
	compareSchemas,
	readJson,
};
