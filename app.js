const express = require('express');

const app = express();


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
    
   res.status(200).json(cities);
 });
module.exports = app;