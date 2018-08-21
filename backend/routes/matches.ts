import * as express from 'express';
import * as wrap from 'express-async-handler';
import { MatchRequest } from './common/requests';
import { Match } from '../entities/match';
import { Session } from '../entities/session';

export const router = express.Router();

router.get('/sessions/:session_id/matches', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.post('/sessions/:session_id/matches', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.get('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.put('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    res.sendStatus(404);
}));

router.delete('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    res.sendStatus(404);
}));
