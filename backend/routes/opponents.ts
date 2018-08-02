import * as express from 'express';
import * as wrap from 'express-async-handler';

export const opponents = express.Router();

opponents.get('/', wrap(async (req, res) => {
}));
