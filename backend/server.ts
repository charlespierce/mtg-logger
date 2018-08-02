import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { CONNECTION_OPTIONS } from './constants';

// Routes
import { formats } from './routes/formats';
import { opponents } from './routes/opponents';
import { archetypes } from './routes/archetypes';

// Entities
import { Archetype } from './entities/archetype';
import { Format } from './entities/format';

const app = express();

app.use(bodyParser.json());
app.use('/formats', formats);
app.use('/opponents', opponents);
app.use('/archetypes', archetypes);

createConnection(CONNECTION_OPTIONS).then(async connection => {
    await connection.runMigrations();

    const format = new Format();
    format.name = 'Modern';
    await format.save();

    const archetype = new Archetype();
    archetype.format = format;
    archetype.name = 'KCI';
    await archetype.save();

    const found = await Archetype.findOne({ where: { format: { name: 'mOdErN' }}});
    console.log(found);
}).catch(err => console.log(err));
