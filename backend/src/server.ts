import dotenv from 'dotenv';
dotenv.config(); // 👈 LOAD ENV ONCE

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import sweetsRoutes from './routes/sweets';

if (!process.env.DB_PASSWORD) {
  throw new Error('❌ .env not loaded properly');
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

// ✅ IMPORTANT: DO NOT START SERVER DURING TESTS
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

export default app;



