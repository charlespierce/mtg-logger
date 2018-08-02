import * as express from 'express';
import * as wrap from 'express-async-handler';

export const archetypes = express.Router();

archetypes.get('/:format', wrap(async (req, res) => {
}));
