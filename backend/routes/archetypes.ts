import * as express from 'express';
import * as wrap from 'express-async-handler';
import { Archetype } from '../entities/archetype';

export const router = express.Router();

router.get('/archetypes/:format', wrap(async (req, res) => {
    const archetypes = await Archetype.find({
        where: { format: { name: req.params.format } },
        order: { name: "ASC" }
    });

    const list = archetypes.map(a => a.name);
    res.send(JSON.stringify(list));
}));
