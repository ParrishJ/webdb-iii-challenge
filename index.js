const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());


const port = process.env.PORT || 5000;
server.listen(port, () =>
    console.log(`***SERVER UP ON PORT ${port}`)
)