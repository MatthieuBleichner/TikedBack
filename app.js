const express = require('express');
const { sql } = require('@vercel/postgres');
// const seed = require('./scripts/seed');
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
  next();
});

async function getMarkets(req, res) {
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

app.post('/api/market', (req, res) => {
  const market = req.body;
  if (
    !market ||
    !market.name ||
    !market.cityId ||
    !market.days ||
    !market.color
  ) {
    return res.status(500).json('missing market properties');
  }
  sql`
    INSERT INTO markets (id, name, cityId, days, color)
    VALUES (uuid_generate_v4(), ${market.name}, ${market.cityId}, ${market.days}, ${market.color})
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
  `
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
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

app.post('/api/city', (req, res) => {
  const city = req.body;
  if (!city || !city.name) {
    return res.status(500).json('missing city properties');
  }
  sql`
    INSERT INTO cities (id, name)
    VALUES (uuid_generate_v4(), ${city.name})
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
  `
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

async function getPricings(req, res) {
  try {
    const result =
      await sql`SELECT * from pricing WHERE marketId=${req.query.marketId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}
app.use('/api/pricings', (req, res) => {
  return getPricings(req, res);
});

app.post('/api/pricing', (req, res) => {
  const pricing = req.body;
  if (!pricing || !pricing.name || !pricing.marketId || !pricing.price) {
    return res.status(500).json('missing client properties');
  }
  sql`
      INSERT INTO pricing (id, name, marketId, price)
      VALUES (uuid_generate_v4(), ${pricing.name}, ${pricing.marketId}, ${pricing.price})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
      `
    .then((result) => {
      console.log('res', result);
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

async function getClients(req, res) {
  console.log('getclients', req);
  try {
    const result =
      await sql`SELECT * from clients WHERE cityId=${req.query.cityId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}
app.use('/api/clients', (req, res) => {
  return getClients(req, res);
});

app.post('/api/client', (req, res) => {
  const client = req.body;
  if (
    !client ||
    !client.firstName ||
    !client.lastName ||
    !client.cityId ||
    !client.siren
  ) {
    return res.status(500).json('missing client properties');
  }
  sql`
        INSERT INTO clients (id, firstName, lastName, cityId, siren)
        VALUES (uuid_generate_v4(), ${client.firstName}, ${client.lastName}, ${client.cityId}, ${client.siren})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
      `
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

async function getBalanceSheets(req, res) {
  try {
    const result =
      await sql`SELECT * from balanceSheets WHERE marketId=${req.query.marketId} AND date=${req.query.date}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}
app.use('/api/balanceSheets', (req, res) => {
  return getBalanceSheets(req, res);
});

app.post('/api/balanceSheet', (req, res) => {
  const balance = req.body;

  if (
    !balance ||
    !balance.date ||
    !balance.marketId ||
    !balance.clientId ||
    balance.status === null
  ) {
    return res.status(500).json('missing properties');
  }
  sql`
        INSERT INTO balanceSheets (id, date, marketId, clientId, status)
        VALUES (uuid_generate_v4(), ${balance.date}, ${balance.marketId}, ${balance.clientId}, ${balance.status})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
      `
    .then((result) => {
      res.status(200).json(result.rows);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

// app.post('/api/seed', () => {
//   return seed();
// });

module.exports = app;
