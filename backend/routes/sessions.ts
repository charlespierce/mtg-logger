import * as express from 'express';
import * as wrap from 'express-async-handler';
import { SessionRequest } from './common/requests';
import { SessionResponse } from './common/responses';
import { Session } from '../entities/session';

export const router = express.Router();

router.get('/sessions', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.post('/sessions', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.get('/sessions/:id', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.put('/sessions/:id', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.delete('/sessions/:id', wrap(async (req, res) => {
    res.sendStatus(404);
}));
