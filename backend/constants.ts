import * as path from 'path';
import { ConnectionOptions } from 'typeorm';

export const CONNECTION_OPTIONS: ConnectionOptions = {
    type: 'sqlite',
    database: ':memory:',
    entities: [ path.join(__dirname, 'entities/*.js') ],
    migrations: [ path.join(__dirname, 'migrations/*.js') ]
};

export enum Result {
    LOSS = 0,
    DRAW = 1,
    WIN = 2
};

export enum Scry {
    TOP = 0,
    BOTTOM = 1
};
