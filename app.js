import express from 'express';
import router from './src/router.js';

const app = express();

app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

app.use((req, res) => {
  return res.status(404).json({
    message: 'Route not found'
  });
});

export default app;
