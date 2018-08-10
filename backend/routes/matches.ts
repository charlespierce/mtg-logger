import * as express from 'express';
import * as wrap from 'express-async-handler';
import { MatchRequest } from './common/requests';
import { MatchDetailResponse, MatchSummaryResponse } from './common/responses';
import { calculateResultFromGames, mapGameToResponse, updateGames } from './helpers/game';
import { Match } from '../entities/match';
import { Session } from '../entities/session';
import { Opponent } from '../entities/opponent';
import { Archetype } from '../entities/archetype';

async function mapMatchToSummaryResponse(match: Match): Promise<MatchSummaryResponse> {
    const opponent = await match.opponent;
    const opponent_archetype = await match.opponent_archetype;
    const result = calculateResultFromGames(await match.games);

    return {
        id: match.id,
        opponent: opponent && opponent.name,
        opponent_archetype: opponent_archetype && opponent_archetype.name,
        result
    };
}

async function mapMatchToDetailResponse(match: Match): Promise<MatchDetailResponse> {
    const opponent = await match.opponent;
    const opponent_archetype = await match.opponent_archetype;
    const games = await match.games;

    return {
        id: match.id,
        notes: match.notes,
        match_date: match.match_date && match.match_date.toLocaleDateString('en-US'),
        opponent: opponent && opponent.name,
        opponent_archetype: opponent_archetype && opponent_archetype.name,
        games: games.map(mapGameToResponse)
    };
}

async function applyRequestToMatch(request: MatchRequest, match: Match, session: Session) {
    match.session = Promise.resolve(session);
    match.notes = request.notes;

    if (request.match_date) {
        match.match_date = new Date(request.match_date);
    }

    if (request.opponent) {
        match.opponent = Opponent.findOrCreate(request.opponent);
    }

    if (request.opponent_archetype) {
        const format = await session.format;

        if (format) {
            match.opponent_archetype = Archetype.findOrCreate(format, request.opponent_archetype);
        } else {
            throw new Error('Session Format does not exist!');
        }
    }
}

export const router = express.Router();

router.get('/sessions/:session_id/matches', wrap(async (req, res) => {
    const matches = await Match.find({
        relations: ['opponent', 'opponent_archetype', 'games'],
        where: { session: { id: req.params.session_id } },
        order: { match_date: 'DESC' }
    });

    const response = await Promise.all(matches.map(mapMatchToSummaryResponse));
    res.send(JSON.stringify(response));
}));

router.post('/sessions/:session_id/matches', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.session_id, {
        relations: ['format']
    });

    if (session) {
        const request: MatchRequest = req.body;
        const match = new Match();
    
        await applyRequestToMatch(request, match, session);
        await match.save();
    
        if (request.games) {
            await updateGames(match, request.games);
        }

        res.sendStatus(201);
    } else {
        res.sendStatus(400);
    }
}));

router.get('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    const match = await Match.findOne(req.params.match_id, {
        relations: ['opponent', 'opponent_archetype', 'games'],
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        const response = await mapMatchToDetailResponse(match);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.put('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    const request: MatchRequest = req.body;
    const match = await Match.findOne(req.params.match_id, {
        relations: ['games', 'session'],
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        const session = await match.session;
        await updateGames(match, request.games);
        await applyRequestToMatch(request, match, session);
        await match.save();

        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}));

router.delete('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    const match = await Match.findOne(req.params.match_id, {
        relations: ['games'],
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        const games = await match.games;
        await Promise.all(games.map(game => game.remove()));
        await match.remove();

        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}));
