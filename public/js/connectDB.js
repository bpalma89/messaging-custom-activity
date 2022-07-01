"use strict";
const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: '89.114.30.7',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

