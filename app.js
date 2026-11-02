import express from 'express';
import router from './src/router.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };

const app = express();

app.use(express.json());

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Books API routes
app.use(router);

// Root route
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Server is running'
  });
});

// Handle routes that do not exist
app.use((req, res) => {
  return res.status(404).json({
    message: 'Route not found'
  });
});

export default app;
