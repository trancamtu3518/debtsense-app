require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const transactionRoutes = require('./routes/transactions');
const nudgeRoutes = require('./routes/nudge');
const scanRoutes = require('./routes/scan');
const reframeRoutes = require('./routes/reframe');
const goalRoutes = require('./routes/goals');
const milestoneRoutes = require('./routes/milestones');
const uxRoutes = require('./routes/ux');
const voiceRoutes = require('./routes/voice');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/nudge', nudgeRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/reframe', reframeRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/ux', uxRoutes);
app.use('/api/voice', voiceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DebtSense API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
