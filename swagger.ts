import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FlightSorter Takehome Test',
      version: '1.0.0',
      description: 'API documentation for my Express application',
    },
  },
  apis: [path.join(__dirname, './src/**/*.ts')],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
