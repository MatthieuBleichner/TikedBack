const express = require('express');
const { sql } = require('@vercel/postgres');

const app = express();

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use('/api/cities', (req, res, next) => {
   const cities = [
      {
        id: 'Lorient',
        title: 'Lorient'
      },
      {
        id: 'Quiberon',
        title: 'Quiberon'
      },
      {
        id: 'Pontivy',
        title: 'Pontivy'
      },
      {
        id: 'BegMeil',
        title: 'BegMeil'
      }
    ];

    const result =
      sql`CREATE TABLE Cities ( id varchar(255), Name varchar(255) );`;
    
   res.status(200).json(cities);
 });
module.exports = app;