import * as express from 'express';
import { json } from 'body-parser';
import { createConnection } from 'typeorm';
import { CONNECTION_OPTIONS } from './constants';

// Routes
import { router as archetypesRouter } from './routes/archetypes';
import { router as gamesRouter } from './routes/games';
import { router as matchesRouter } from './routes/matches';
import { router as opponentsRouter } from './routes/opponents';
import { router as sessionsRouter } from './routes/sessions';

const app = express();

app.use(json(),
        archetypesRouter,
        gamesRouter,
        matchesRouter,
        opponentsRouter,
        sessionsRouter);

createConnection(CONNECTION_OPTIONS).then(async connection => {
    await connection.runMigrations();

    app.listen(3000, () => console.log('Listening on Port 3000'));
}).catch(err => console.log(err));
