const express = require('express');
const db = require('sqlite');
const constants = require('./constants');

const app = express();

app.get('/', async (req, res) => {
    const opps = await db.all('SELECT * FROM opponents;');
    res.send(JSON.stringify(opps));
});

app.get('/create', async (req, res) => {
    await db.run('INSERT INTO opponents (name) VALUES (\'George\');');
    res.send('Success!');
});

db.open(constants.DATABASE_FILE)
    .then(() => db.migrate(constants.MIGRATION_OPTIONS))
    .then(() => app.listen(3000))
    .then(() => console.log('App listening on port 3000'))
    .catch((err) => console.log(err));
