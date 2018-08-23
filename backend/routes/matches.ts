import { Router } from 'express';
import * as wrap from 'express-async-handler';
import { MatchRequest } from './common/requests';
import { MatchSummaryResponse, MatchDetailResponse } from './common/responses';
import { Result } from "../constants";
import { Game } from "../entities/game";
import { Match, MatchUpdateProperties } from '../entities/match';
import { Session } from '../entities/session';

function formatResults(wins: number, losses: number, draws: number) {
    if (draws) {
        return `${wins}-${losses}-${draws}`;
    }

    return `${wins}-${losses}`;
}

function calculateResult(games: Game[]) {
    const wins = games.filter(game => game.result === Result.WIN).length;
    const losses = games.filter(game => game.result === Result.LOSS).length;
    const draws = games.length - wins - losses;

    if (wins > losses) {
        return `Win ${formatResults(wins, losses, draws)}`;
    } else if (losses > wins) {
        return `Loss ${formatResults(wins, losses, draws)}`;
    }

    return `Draw ${formatResults(wins, losses, draws)}`;
}

async function buildSummaryResponse(match: Match): Promise<MatchSummaryResponse> {
    return {
        id: match.id,
        opponent: match.opponent,
        opponent_archetype: match.opponent_archetype,
        result: calculateResult(await match.games)
    };
}

function buildDetailResponse(match: Match): MatchDetailResponse {
    return {
        id: match.id,
        opponent: match.opponent,
        opponent_archetype: match.opponent_archetype,
        notes: match.notes,
        match_date: match.match_date && match.match_date.toLocaleDateString('en-US')
    };
}

function buildUpdater(request: MatchRequest): Pick<Match, MatchUpdateProperties> {
    return {
        ...request,
        match_date: request.match_date && new Date(request.match_date) || undefined
    }
}

export const router = Router();

router.get('/sessions/:session_id/matches', wrap(async (req, res) => {
    const matches = await Match.find({
        where: { session: { id: req.params.session_id } },
        relations: ['games']
    });

    const response = await Promise.all(matches.map(buildSummaryResponse));
    res.send(JSON.stringify(response));
}));

router.post('/sessions/:session_id/matches', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.session_id);

    if (session) {
        const match = new Match();
        match.session = Promise.resolve(session);
        await match.save();

        const response = buildDetailResponse(match);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(400);
    }
}));

router.get('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    const match = await Match.findOne(req.params.match_id, {
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        const response = buildDetailResponse(match);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.put('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    const match = await Match.findOne(req.params.match_id, {
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        Object.assign(match, buildUpdater(req.body));
        await match.save();

        const response = buildDetailResponse(match);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.delete('/session/:session_id/matches/:match_id', wrap(async (req, res) => {
    const match = await Match.findOne(req.params.match_id, {
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        await match.remove();
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}));
