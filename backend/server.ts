import * as express from 'express';
import * as bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import { CONNECTION_OPTIONS } from './constants';

// Routes
import { router as archetypesRouter } from './routes/archetypes';
import { router as formatsRouter } from './routes/formats';
import { router as opponentsRouter } from './routes/opponents';
import { router as sessionsRouter } from './routes/sessions';

const app = express();

app.use(bodyParser.json());
app.use('/archetypes', archetypesRouter);
app.use('/formats', formatsRouter);
app.use('/opponents', opponentsRouter);
app.use('/sessions', sessionsRouter);

createConnection(CONNECTION_OPTIONS).then(async connection => {
    await connection.runMigrations();

    app.listen(3000, () => console.log('Listening on Port 3000'));
}).catch(err => console.log(err));
