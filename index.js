const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(helmet());
server.use(express.json());

server.post('/api/cohorts', (req, res) => {
    if (req.body.name) {
        db('cohorts')
            .insert(req.body, 'id')
            .then(ids => {
                res.status(201).json(ids)
            })
            .catch(error => {
                res.status(500).json({ error: "Could not add cohort" })
            })
    } else {
        res.status(400).json({ error: "Must incluse cohort name" })
    }
})

server.get('/api/cohorts', (req, res) => {
    db('cohorts')
        .then(cohorts => {
            res.status(200).json(cohorts)
        })
        .catch(error => {
            res.status(500).json({ error: "Could not retrieve cohorts" })
        });
});


const port = process.env.PORT || 5000;
server.listen(port, () =>
    console.log(`***SERVER UP ON PORT ${port}`)
)