import * as express from 'express';
import * as wrap from 'express-async-handler';
import { getConnection } from 'typeorm';

export const router = express.Router();

type OpponentResult = { opponent: string };

router.get('/opponents', wrap(async (req, res) => {
    const connection = getConnection();
    const queryString = `SELECT DISTINCT opponent FROM matches WHERE opponent IS NOT NULL`;
    const results: OpponentResult[] = await connection.query(queryString);

    res.send(results.map(result => result.opponent));
}));
