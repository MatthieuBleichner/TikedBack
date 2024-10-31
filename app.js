const express = require('express');
const { seed, update } = require('./scripts/seed');
const marketsRoutes = require('./routes/markets');
const usersRoutes = require('./routes/users');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());
app.use('/api', marketsRoutes);
app.use('/user', usersRoutes);

app.post('/api/seed', () => {
  return seed();
});

module.exports = app;
