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

server.get('/students', (req, res) => {
    db('students')
        .then(students => {
            res.status(200).json(students)
        })
        .catch(error => {
            res.status(500).json({ error: "Could not retrieve students" })
        });
});

server.get('/api/cohorts/:id', (req, res) => {
    db('cohorts')
        .where({ id: req.params.id })
        .first()
        .then(cohort => {
            if (cohort) {
                res.status(200).json(cohort)
            } else {
                res.status(404).json({ error: "No record for this cohort" })
            }
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

server.get('/api/cohorts/:id/students', (req, res) => {
    const id = req.params.id
    studentsByCohort(id)
        .then(students => {
            res.status(200).json(students)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

server.put('/api/cohorts/:id', (req, res) => {
    const changes = req.body
    db('cohorts')
        .where({ id: req.params.id })
        .update(changes)
        .then(count => {
            if (count > 0) {
                res.status(200).json(count)
            } else {
                res.status(404).json({ message: "Cohort not found" })
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

server.delete('/api/cohorts/:id', (req, res) => {
    db('cohorts')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            if (count > 0) {
                const unit = count > 1 ? 'cohorts' : 'cohort'
                res.status(200).json({ message: `${count} ${unit} deleted` })
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

function studentsByCohort(id) {
    return db('students')
        .join('cohorts', 'cohorts.id', 'students.cohort_id')
        .select('students.id', 'students.name as studentname', 'cohorts.name as cohort')
        .where('students.cohort_id', id)
}


const port = process.env.PORT || 5000;
server.listen(port, () =>
    console.log(`***SERVER UP ON PORT ${port}`)
)