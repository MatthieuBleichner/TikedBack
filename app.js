const express = require('express');
// const { seed, update } = require('./scripts/seed');
const marketsRoutes = require('./routes/markets');
const usersRoutes = require('./routes/users');
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api', marketsRoutes);
app.use('/user', usersRoutes);

// app.post('/api/seed', () => {
//   return seed();
// });

module.exports = app;
