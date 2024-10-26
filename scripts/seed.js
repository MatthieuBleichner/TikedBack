const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const util = require('util');

const mockedUsers = [];

async function seedUsers() {
  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS users
     `;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }

  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        privilege INT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      mockedUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return sql`
        INSERT INTO users (id, name, email, password, privilege)
        VALUES (uuid_generate_v4(), ${user.name}, ${user.email}, ${hashedPassword}, ${user.privilege})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

const mockedCities = [
  {
    name: 'Lorient',
  },
  {
    name: 'Quiberon',
  },
  {
    name: 'Pontivy',
  },
  {
    name: 'BegMeil',
  },
  {
    name: 'Betton',
  },
  {
    name: 'Sucé sur Erdre',
  },
];

const MockedMarkets = [
  {
    id: 'GrandMarcheDelorient',
    name: 'Grand Marché de Lorient',
    cityIndex: '0',
    dates: 'L,M,M,J,V,S,D',
    color: '#ef5350',
  },
  {
    id: 'MarchéDuLundi',
    name: 'Marché du Lundi',
    cityIndex: '0',
    dates: 'L',
    color: '#64b5f6',
  },
  {
    id: 'BraderieDuWeekend',
    name: 'Braderie du weekend',
    cityIndex: '0',
    dates: 'S,D',
    color: '#1de9b6',
  },
  {
    id: 'MarcheDuVarquez',
    name: 'Marché du Varquez',
    cityIndex: '1',
    dates: 'S,D',
    color: '#651fff',
  },
  {
    id: 'MarchéPortHaliguen',
    name: 'Marché de Port Haliguen',
    cityIndex: '1',
    dates: 'D',
    color: '#ef5350',
  },
  {
    id: 'MarcheDeNoel',
    name: 'Marché de Noel',
    cityIndex: '2',
    dates: 'J,V,S,D',
    color: '#64b5f6',
  },
  {
    id: 'MarcheDuDimanche',
    name: 'Marché du Dimanche',
    cityIndex: '3',
    dates: 'D',
    color: '#651fff',
  },
  {
    id: 'MarchéEglise',
    name: 'Marché de l Eglise',
    cityIndex: '4',
    dates: 'D',
    color: '#ef5350',
  },
  {
    id: 'MarcheDimanche',
    name: 'Marché du dimanche matin',
    cityIndex: '5',
    dates: 'D',
    color: '#64b5f6',
  },
];

const MockedClients = [
  {
    firstName: 'Matthieu',
    lastName: 'Bleichner',
    cityIndex: '0',
    siren: '111111111',
    postal_code: '44240',
    city: 'Sucé sur Erdre',
    address: '699 route de la grande Bodinière',
    mail: 'matthieu258@hotmail.com',
    job: 'boulanger',
  },
];

const MockedPricings = [
  {
    id: 'GrandMarcheDelorient-Abonne',
    name: 'Abonnement annuel',
    marketIndex: '0',
    price: 2,
    dynamic_unit: 'none',
  },
  {
    id: 'GrandMarcheDelorient-Ponctuel',
    name: 'Abonnement saison',
    marketIndex: '0',
    price: 3,
    dynamic_unit: 'none',
  },
  {
    id: 'GrandMarcheDelorient-Autre',
    name: 'Electricite',
    marketIndex: '0',
    price: 4,
    dynamic_unit: 'none',
  },
  {
    id: 'GrandMarcheDelorient-Autre',
    name: 'Metrage',
    marketIndex: '0',
    price: 4,
    dynamic_unit: 'meters',
  },
  {
    id: 'MarchéDuLundi-Abonné',
    name: 'Abonné',
    marketIndex: '1',
    price: 2.5,
    dynamic_unit: 'none',
  },
  {
    id: 'BraderieDuWeekend-Abonné',
    name: 'Abonné',
    marketIndex: '2',
    price: 2.5,
    dynamic_unit: 'none',
  },
  {
    id: 'MarcheDuVarquez-Abonné',
    name: 'Abonné',
    marketIndex: '3',
    price: 1.5,
    dynamic_unit: 'none',
  },
  {
    id: 'MarchéPortHaliguen-Abonné',
    name: 'Abonné',
    marketIndex: '4',
    price: 5.5,
    dynamic_unit: 'none',
  },
  {
    id: 'MarcheDeNoel-Abonné',
    name: 'Abonné',
    marketIndex: '5',
    price: 0.5,
    dynamic_unit: 'none',
  },
];
async function seedCities() {
  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS invoices
     `;
  } catch (error) {
    console.error('Error deleting invoices:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS balancesheets
     `;
  } catch (error) {
    console.error('Error deleting cities:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS pricing
     `;
  } catch (error) {
    console.error('Error seeding pricing:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS markets
     `;
  } catch (error) {
    console.error('Error seeding markets:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS clients
     `;
  } catch (error) {
    console.error('Error seeding cities:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE IF EXISTS cities
     `;
  } catch (error) {
    console.error('Error seeding cities:', error);
    throw error;
  }

  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "invoices" table if it doesn't exist
    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS cities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    invoice_prefix SERIAL
  );
`;

    console.log(`Created "cities" table`);

    // Insert data into the "cities" table
    const insertedCities = await Promise.all(
      mockedCities.map(
        (city) => sql`
        INSERT INTO cities (id, name)
        VALUES (uuid_generate_v4(), ${city.name})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
      `,
      ),
    );

    console.log(`Seeded ${util.inspect(insertedCities.length)} cities`);

    // create markets table
    await sql`
    CREATE TABLE IF NOT EXISTS markets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    city_id UUID NOT NULL,
    days VARCHAR(255),
    color VARCHAR(255),
    invoice_prefix SERIAL,
    FOREIGN KEY (city_id) REFERENCES cities (id)
  );
`;

    const insertedMarkets = await Promise.all(
      MockedMarkets.map(
        (market) => sql`
    INSERT INTO markets (id, name, city_id, days, color)
    VALUES (uuid_generate_v4(), ${market.name}, ${insertedCities[market.cityIndex].rows[0].id}, ${market.dates}, ${market.color})
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
  `,
      ),
    );

    console.log(`Seeded ${util.inspect(insertedMarkets.length)} markets`);

    insertedMarkets.map((market) => {
      console.log(market.rows);
    });

    //create type dynamic_unit
    await sql`
    DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dynamic_unit') THEN
            create type dynamic_unit AS ENUM ('none', 'meters', 'hours');
          END IF;
      END
    $$;
  `;

    // create pricing table
    await sql`
    CREATE TABLE IF NOT EXISTS pricing (
    id VARCHAR(255) PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL,
    market_id UUID NOT NULL,
    price FLOAT,
    dynamic_unit dynamic_unit,
    FOREIGN KEY (market_id) REFERENCES markets (id)
  );
`;

    const insertedPricing = await Promise.all(
      MockedPricings.map((pricing) => {
        console.log('pricing', pricing);
        console.log(
          `${insertedMarkets[pricing.marketIndex].rows[0].name}-${pricing.name}`,
        );
        sql`
      INSERT INTO pricing (id, name, market_id, price, dynamic_unit)
      VALUES (uuid_generate_v4(), ${pricing.name}, ${insertedMarkets[pricing.marketIndex].rows[0].id}, ${pricing.price}, ${pricing.dynamic_unit})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
      }),
    );

    console.log(`Seeded ${util.inspect(insertedPricing.length)} pricings`);

    // create clients table
    await sql`
        CREATE TABLE IF NOT EXISTS clients (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        city_id UUID NOT NULL,
        postal_code INTEGER,
        city VARCHAR(255),
        address VARCHAR(255),
        mail VARCHAR(255),
        job VARCHAR(255),
        siren VARCHAR(255),
        FOREIGN KEY (city_id) REFERENCES cities (id)
      );
    `;

    const insertedClients = await Promise.all(
      MockedClients.map(
        (client) => sql`
        INSERT INTO clients (id, first_name, last_name, city_id, siren, postal_code, city, address, mail, job)
        VALUES (uuid_generate_v4(), ${client.firstName}, ${client.lastName}, ${insertedCities[client.cityIndex].rows[0].id}, ${client.siren}, ${client.postal_code}, ${client.city}, ${client.address}, ${client.mail}, ${client.job})
        ON CONFLICT (id) DO NOTHING
        RETURNING *;
      `,
      ),
    );

    console.log(`Seeded ${util.inspect(insertedClients.length)} clients`);

    // create balanceSheet table
    await sql`
        CREATE TABLE IF NOT EXISTS balanceSheets (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        date DATE NOT NULL,
        market_id UUID NOT NULL,
        FOREIGN KEY (market_id) REFERENCES markets (id)
      );
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

    return {
      createTable,
      cities: insertedCities,
    };
  } catch (error) {
    console.error('Error seeding cities:', error);
    throw error;
  }
}

async function seed() {
  await seedUsers();
  await seedCities();
}

async function update() {
  try {
    await sql`
      ALTER TABLE invoices
      ADD paiement_type paiement_method
  `;
  } catch (error) {
    console.error('Error updating clients:', error);
    throw error;
  }
}
module.exports = { seed, update };
