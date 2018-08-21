import * as express from 'express';
import * as wrap from 'express-async-handler';
import { getConnection } from 'typeorm';

export const router = express.Router();

router.get('/formats', wrap(async (req, res) => {
    res.sendStatus(404);
}));
