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

    res.send(JSON.stringify(opponents));
}));
