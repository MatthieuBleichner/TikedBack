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

async function deleteMarket(req, res) {
  const id = req.params.id;
  if (!id) {
    return res.status(500).json('id is missing');
  }
  try {
    const result = await sql`
      DELETE FROM markets WHERE id=${id};
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
        INSERT INTO pricing (id, name, market_id, price, dynamic_unit)
        VALUES (uuid_generate_v4(), ${pricing.name}, ${pricing.market_id}, ${pricing.price}, ${pricing.dynamic_unit || 'none'})
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
    const linkedMarket = (
      await sql`SELECT * from markets WHERE id=${balance.market_id}`
    ).rows[0];
    const linkedCity = (
      await sql`SELECT * from cities WHERE id=${linkedMarket.city_id}`
    ).rows[0];

    const balanceSheetDate = new Date(balance.date);
    const currentCityPrefix = ('00' + linkedCity?.invoice_prefix).slice(-3);
    const currentMarketPrefix = ('00' + linkedMarket?.invoice_prefix).slice(-3);
    const currentMonthPrefix = ('0' + (balanceSheetDate.getMonth() + 1)).slice(
      -2,
    );

    const currentDayPrefix = ('0' + balanceSheetDate.getDate()).slice(-2);
    const fullInvoicePrefix = `${currentCityPrefix}-${currentMarketPrefix}-${balanceSheetDate.getFullYear()}${currentMonthPrefix}${currentDayPrefix}`;

    const result = await sql`
          INSERT INTO balanceSheets (id, date, market_id, invoice_prefix)
          VALUES (uuid_generate_v4(), ${balance.date}, ${balance.market_id}, ${fullInvoicePrefix} )
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

async function deleteBalanceSheet(req, res) {
  const id = req.params.id;
  if (!id) {
    return res.status(500).json('id is missing');
  }
  try {
    const result = await sql`
      DELETE FROM balanceSheets WHERE id=${id};
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

  // create invoices table
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

  try {
    const linkedBalanceSheet = (
      await sql`SELECT * from balanceSheets WHERE id=${details.balance_sheet_id}`
    ).rows[0];

    const invoicesLength = (
      await sql`SELECT * from invoices WHERE balance_sheet_id=${details.balance_sheet_id}`
    ).rows.length;

    const formattedInvoiceLength = ('00000' + (invoicesLength + 1)).slice(-7);

    const invoiceId = `${linkedBalanceSheet.invoice_prefix}-${formattedInvoiceLength}`;

    const result = await sql`
          INSERT INTO invoices (id, balance_sheet_id, client_id, total, paiement_type, invoice_id)
          VALUES (uuid_generate_v4(), ${details.balance_sheet_id}, ${details.client_id}, ${details.total}, ${details.paiement_type}, ${invoiceId})
          ON CONFLICT (id) DO NOTHING
          RETURNING *;
        `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function deleteInvoice(req, res) {
  const id = req.params.id;
  if (!id) {
    return res.status(500).json('id is missing');
  }
  try {
    const result = await sql`
      DELETE FROM invoices WHERE id=${id};
    `;
    res.status(200).json(result.rows);
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  getMarkets,
  addMarket,
  deleteMarket,
  getCities,
  addCity,
  getPricings,
  addPricing,
  getClients,
  addClient,
  getBalanceSheets,
  addBalanceSheet,
  updateBalanceSheet,
  deleteBalanceSheet,
  getInvoices,
  addInvoice,
  deleteInvoice,
};
