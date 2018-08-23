import { Router } from 'express';
import * as wrap from 'express-async-handler';
import { GameRequest } from './common/requests';
import { GameResponse } from './common/responses';
import { Game, GameUpdateProperties } from '../entities/game';
import { Match } from '../entities/match';

function buildResponse(game: Game): GameResponse {
    return {
        id: game.id,
        first_turn: game.first_turn,
        result: game.result,
        final_turn: game.final_turn,
        sideboarded: game.sideboarded,
        starting_hand: game.starting_hand,
        pre_game_scry: game.pre_game_scry,
        opponent_starting_hand: game.opponent_starting_hand,
        opponent_pre_game_scry: game.opponent_pre_game_scry,
        notes: game.notes
    };
}

function buildUpdater(request: GameRequest): Pick<Game, GameUpdateProperties> {
    return request;
}

export const router = Router();

router.get('/sessions/:session_id/matches/:match_id/games', wrap(async (req, res) => {
    const games = await Game.find({
        where: { match: { id: req.params.match_id, session: { id: req.params.session_id } } }
    });

    const response = games.map(buildResponse);
    res.send(JSON.stringify(response));
}));

router.post('/sessions/:session_id/matches/:match_id/games', wrap(async (req, res) => {
    const match = await Match.findOne(req.params.match_id, {
        where: { session: { id: req.params.session_id } }
    });

    if (match) {
        const game = new Game();
        game.match = Promise.resolve(match);
        await game.save();

        const response = buildResponse(game);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(400);
    }
}));

router.get('/sessions/:session_id/matches/:match_id/games/:game_id', wrap(async (req, res) => {
    const game = await Game.findOne(req.params.game_id, {
        where: { match: { id: req.params.match_id, session: { id: req.params.session_id } } }
    });

    if (game) {
        const response = buildResponse(game);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.put('/sessions/:session_id/matches/:match_id/games/:game_id', wrap(async (req, res) => {
    const game = await Game.findOne(req.params.game_id, {
        where: { match: { id: req.params.match_id, session: { id: req.params.session_id } } }
    });

    if (game) {
        Object.assign(game, buildUpdater(req.body));
        await game.save();

        const response = buildResponse(game);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.delete('/sessions/:session_id/matches/:match_id/games/:game_id', wrap(async (req, res) => {
    const game = await Game.findOne(req.params.game_id, {
        where: { match: { id: req.params.match_id, session: { id: req.params.session_id } } }
    });

    if (game) {
        await game.remove();
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}));
