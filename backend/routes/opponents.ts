import * as express from 'express';
import * as wrap from 'express-async-handler';
import { Opponent } from '../entities/opponent';

export const router = express.Router();

router.get('/', wrap(async (req, res) => {
    const opponents = await Opponent.find({
        order: {
            name: "ASC"
        }
    });

    const list = opponents.map(o => o.name);
    res.send(JSON.stringify(list));
}));
