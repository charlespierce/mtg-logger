import * as express from 'express';
import * as wrap from 'express-async-handler';

export const router = express.Router();

router.get('/opponents', wrap(async (req, res) => {
    res.sendStatus(404);
}));
