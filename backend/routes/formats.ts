import * as express from 'express';
import * as wrap from 'express-async-handler';
import { Format } from '../entities/format';

export const router = express.Router();

router.get('/', wrap(async (req, res) => {
    const formats = await Format.find({
        order: {
            name: "ASC"
        }
    });

    const list = formats.map(f => f.name);
    res.send(JSON.stringify(list));
}));
