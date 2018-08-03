import * as express from 'express';
import * as wrap from 'express-async-handler';
import { Archetype } from '../entities/archetype';
import { Format } from '../entities/format';

export const router = express.Router();

router.get('/:format', wrap(async (req, res) => {
    let archetypes: Archetype[] = [];
    const format = await Format.findOne(req.params.format);

    if (format) {
        archetypes = await Archetype.find({
            where: { format },
            order: {
                name: "ASC"
            }
        });
    }

    res.send(JSON.stringify(archetypes));
}));
