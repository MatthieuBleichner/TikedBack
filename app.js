const express = require('express');
const { sql } = require('@vercel/postgres');
// const seed = require('./scripts/seed');
const app = express();

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
  next();
});

async function getMarkets(req, res) {
  console.log('req.query', req.query);
  try {
    const result =
      await sql`SELECT * from markets WHERE cityId=${req.query.cityId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

app.use('/api/markets', (req, res) => {
  return getMarkets(req, res);
});

async function getCities(res) {
  try {
    const result = await sql`SELECT * from cities`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}
app.use('/api/cities', (req, res) => {
  return getCities(res);
});

// app.post('/api/seed', () => {
//   return seed();
// });

module.exports = app;
