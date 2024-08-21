const express = require('express');
const { sql } = require('@vercel/postgres');
const seed = require('./scripts/seed');
const app = express();

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.post('/api/cities', (req, res, next) => {
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

   //  try {
   //    const result =
   //      sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
   //    return res.status(200).json(cities);
   //  } catch (error) {
   //    return  res.status(500).json(error);
   //  }

   try {
      const result =
        sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
        res.status(200).json(result);
    } catch (error) {
      return  res.status(500).json(error);
    }
   //  const result =
   //    sql`CREATE TABLE Cities ( id varchar(255), Name varchar(255) );`;
    
   res.status(200).json(cities);
 });

//  app.post('/api/seed', (req, res, next) => {
//    return seed()
//  });

module.exports = app;