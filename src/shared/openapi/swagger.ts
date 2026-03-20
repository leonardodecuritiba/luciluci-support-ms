import swaggerJSDoc from 'swagger-jsdoc';

const isDev = process.env.NODE_ENV !== 'production';

const swaggerOptions: swaggerJSDoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'standard-ms',
			version: '1.0.0',
			description:
				'OpenAPI contract for the standard-ms template. Public authentication uses Bearer JWT via Identity MS, with validation enforced upstream by the API Gateway/BFF. The local Express bootstrap accepts X-Auth-* headers only for development and test flows.',
		},
	},
	apis: isDev
		? [
				'src/features/**/adapters/routes/**/*.ts',
				'src/features/**/adapters/controllers/dtos/**/*.ts',
				'src/shared/openapi/**/*.ts',
			]
		: [
				'dist/features/**/adapters/routes/**/*.js',
				'dist/features/**/adapters/controllers/dtos/**/*.js',
				'dist/shared/openapi/**/*.js',
			],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
