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

    res.send(JSON.stringify(formats));
}));
