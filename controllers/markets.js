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
      await sql`SELECT * from clients WHERE city_id=${req.query.cityId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addClient(req, res) {
  const client = req.body;
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
          INSERT INTO clients (id, first_name, last_name, city_id, siren, postal_code, city, address, mail, job)
          VALUES (uuid_generate_v4(), ${client.first_name}, ${client.last_name}, ${client.city_id}, ${client.siren}, ${client.postal_code}, ${client.city}, ${client.address}, ${client.mail}, ${client.job})
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
    const result = req.query?.date
      ? await sql`SELECT * from balanceSheets WHERE market_id=${req.query.marketId} AND date=${req.query.date} ORDER BY date DESC`
      : await sql`SELECT * from balanceSheets WHERE market_id=${req.query.marketId} ORDER BY date DESC`;

    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addBalanceSheet(req, res) {
  const balance = req.body;

  if (!balance || !balance.date || !balance.market_id) {
    return res.status(500).json('missing properties');
  }

  try {
    const result = await sql`
          INSERT INTO balanceSheets (id, date, market_id)
          VALUES (uuid_generate_v4(), ${balance.date}, ${balance.market_id})
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

async function getInvoices(req, res) {
  try {
    const result =
      await sql`SELECT * from invoices WHERE balance_sheet_id=${req.query.balanceSheetId}`;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addInvoice(req, res) {
  const details = req.body;

  console.log('add invoide dans le back');
  if (
    !details ||
    !details.balance_sheet_id ||
    !details.client_id ||
    !details.total
  ) {
    return res.status(500).json('missing properties');
  }

  //create type paiement_method
  await sql`
    DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'paiement_method') THEN
            create type paiement_method AS ENUM ('cash', 'cb', 'check');
          END IF;
      END
    $$;
  `;

  // create balanceSheet table
  await sql`
      CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      client_id UUID NOT NULL,
      balance_sheet_id UUID NOT NULL,
      total FLOAT,
      paiement_type paiement_method,
      invoice_id VARCHAR(255),
      FOREIGN KEY (balance_sheet_id) REFERENCES balanceSheets (id),
      FOREIGN KEY (client_id) REFERENCES clients (id)
    );
  `;

  console.log('details', details);

  try {
    const result = await sql`
          INSERT INTO invoices (id, balance_sheet_id, client_id, total, paiement_type, invoice_id)
          VALUES (uuid_generate_v4(), ${details.balance_sheet_id}, ${details.client_id}, ${details.total}, ${details.paiement_type}, ${details.invoice_id})
          ON CONFLICT (id) DO NOTHING
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
  getInvoices,
  addInvoice,
};
