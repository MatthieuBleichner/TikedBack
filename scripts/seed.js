const { sql } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
const util = require('util');

const mockedUsers = [];

async function seedUsers() {
  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE users
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
  },
];

const MockedPricings = [
  {
    id: 'GrandMarcheDelorient-Abonne',
    name: 'Abonnement annuel',
    marketIndex: '0',
    price: 2,
  },
  {
    id: 'GrandMarcheDelorient-Ponctuel',
    name: 'Abonnement saison',
    marketIndex: '0',
    price: 3,
  },
  {
    id: 'GrandMarcheDelorient-Autre',
    name: 'Electricite',
    marketIndex: '0',
    price: 4,
  },
  {
    id: 'GrandMarcheDelorient-Autre',
    name: 'Metrage',
    marketIndex: '0',
    price: 4,
  },
  {
    id: 'MarchéDuLundi-Abonné',
    name: 'Abonné',
    marketIndex: '1',
    price: 2.5,
  },
  {
    id: 'BraderieDuWeekend-Abonné',
    name: 'Abonné',
    marketIndex: '2',
    price: 2.5,
  },
  {
    id: 'MarcheDuVarquez-Abonné',
    name: 'Abonné',
    marketIndex: '3',
    price: 1.5,
  },
  {
    id: 'MarchéPortHaliguen-Abonné',
    name: 'Abonné',
    marketIndex: '4',
    price: 5.5,
  },
  {
    id: 'MarcheDeNoel-Abonné',
    name: 'Abonné',
    marketIndex: '5',
    price: 0.5,
  },
];
async function seedCities() {
  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE balanceSheetDetails
     `;
  } catch (error) {
    console.error('Error deleting balanceSheetDetails:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE balancesheets
     `;
  } catch (error) {
    console.error('Error deleting cities:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE pricing
     `;
  } catch (error) {
    console.error('Error seeding pricing:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE markets
     `;
  } catch (error) {
    console.error('Error seeding markets:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE clients
     `;
  } catch (error) {
    console.error('Error seeding cities:', error);
    throw error;
  }

  try {
    // Create the "users" table if it doesn't exist
    await sql`
       DROP TABLE cities
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
    name TEXT NOT NULL UNIQUE
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

    // create pricing table
    await sql`
    CREATE TABLE IF NOT EXISTS pricing (
    id VARCHAR(255) PRIMARY KEY UNIQUE,
    name VARCHAR(255) NOT NULL,
    market_id UUID NOT NULL,
    price FLOAT,
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
      INSERT INTO pricing (id, name, market_id, price)
      VALUES (uuid_generate_v4(), ${pricing.name}, ${insertedMarkets[pricing.marketIndex].rows[0].id}, ${pricing.price})
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
        siren VARCHAR(255),
        FOREIGN KEY (city_id) REFERENCES cities (id)
      );
    `;

    const insertedClients = await Promise.all(
      MockedClients.map(
        (client) => sql`
        INSERT INTO clients (id, first_name, last_name, city_id, siren)
        VALUES (uuid_generate_v4(), ${client.firstName}, ${client.lastName}, ${insertedCities[client.cityIndex].rows[0].id}, ${client.siren})
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

module.exports = seed;
