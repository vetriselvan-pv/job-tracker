
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import jobRoutes from './modules/job-tracker/job-tracker.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('Job Tracker Server API is running');
});

import { errorHandler } from './middleware/error.middleware';

// Start server
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
