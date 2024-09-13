const { sql } = require('@vercel/postgres');

async function getMarkets(req, res) {
  try {
    const result =
      await sql`SELECT * from markets WHERE city_id=${req.query.cityId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addMarket(req, res) {
  const market = req.body;
  if (
    !market ||
    !market.name ||
    !market.city_id ||
    !market.days ||
    !market.color
  ) {
    return res.status(500).json('missing market properties');
  }
  try {
    const result = await sql`
      INSERT INTO markets (id, name, city_id, days, color)
      VALUES (uuid_generate_v4(), ${market.name}, ${market.city_id}, ${market.days}, ${market.color})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function getCities(req, res) {
  try {
    const result = await sql`SELECT * from cities`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addCity(req, res) {
  const city = req.body;
  if (!city || !city.name) {
    return res.status(500).json('missing city properties');
  }
  try {
    const result = await sql`
      INSERT INTO cities (id, name)
      VALUES (uuid_generate_v4(), ${city.name})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function getPricings(req, res) {
  try {
    const result =
      await sql`SELECT * from pricing WHERE market_id=${req.query.marketId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addPricing(req, res) {
  const pricing = req.body;
  if (!pricing || !pricing.name || !pricing.market_id || !pricing.price) {
    return res.status(500).json('missing client properties');
  }
  try {
    const result = await sql`
        INSERT INTO pricing (id, name, market_id, price)
        VALUES (uuid_generate_v4(), ${pricing.name}, ${pricing.market_id}, ${pricing.price})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
        `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function getClients(req, res) {
  try {
    const result =
      await sql`SELECT * from clients WHERE city_id=${req.query.city_id}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addClient(req, res) {
  const client = req.body;
  console.log(
    'client',
    client,
    '!client.first_name',
    !client.first_name,
    '!client.last_name',
    !client.last_name,
    '!client.city_id',
    !client.city_id,
    '!client.siren',
    !client.siren,
  );
  if (
    !client ||
    !client.first_name ||
    !client.last_name ||
    !client.city_id ||
    !client.siren
  ) {
    return res.status(500).json('missing client properties');
  }

  try {
    const result = await sql`
          INSERT INTO clients (id, first_name, last_name, city_id, siren)
          VALUES (uuid_generate_v4(), ${client.first_name}, ${client.last_name}, ${client.city_id}, ${client.siren})
          ON CONFLICT (id) DO NOTHING
          RETURNING *;
        `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function getBalanceSheets(req, res) {
  try {
    const result =
      await sql`SELECT * from balanceSheets WHERE market_id=${req.query.marketId} AND date=${req.query.date}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addBalanceSheet(req, res) {
  const balance = req.body;

  if (
    !balance ||
    !balance.date ||
    !balance.market_id ||
    !balance.clientId ||
    balance.status === null
  ) {
    return res.status(500).json('missing properties');
  }

  try {
    const result = await sql`
          INSERT INTO balanceSheets (id, date, market_id, clientId, status)
          VALUES (uuid_generate_v4(), ${balance.date}, ${balance.market_id}, ${balance.clientId}, ${balance.status})
          ON CONFLICT (id) DO NOTHING
          RETURNING *;
        `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function updateBalanceSheet(req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(500).json('missing properties');
  }

  try {
    const result = await sql`
            UPDATE balanceSheets SET status=${req.body.status} WHERE id=${id}
            RETURNING *;
          `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getMarkets,
  addMarket,
  getCities,
  addCity,
  getPricings,
  addPricing,
  getClients,
  addClient,
  getBalanceSheets,
  addBalanceSheet,
  updateBalanceSheet,
};
