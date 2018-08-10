import { GameRequest } from '../common/requests';
import { GameResponse } from '../common/responses';
import { Game } from '../../entities/game';
import { Match } from '../../entities/match';
import { Result } from '../../constants';

export function mapGameToResponse(game: Game): GameResponse {
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

function applyRequestToGame(request: GameRequest, game: Game) {
    game.first_turn = request.first_turn;
    game.result = request.result;
    game.final_turn = request.final_turn;
    game.sideboarded = request.sideboarded;
    game.starting_hand = request.starting_hand;
    game.pre_game_scry = request.pre_game_scry;
    game.opponent_starting_hand = request.opponent_starting_hand;
    game.opponent_pre_game_scry = request.opponent_pre_game_scry;
    game.notes = request.notes;
}

export async function updateGames(match: Match, requests: GameRequest[] = []) {
    const games = await match.games;

    // Add all new Games to the DB
    await Promise.all(requests.filter(gameRequest => gameRequest.id == undefined).map(async (gameRequest) => {
        const game = new Game();
        game.match = Promise.resolve(match);
        await applyRequestToGame(gameRequest, game);
        await game.save();
    }));

    // Update and remove existing Games
    await Promise.all(games.map(async (game) => {
        const gameRequest = requests.find(request => request.id === game.id);

        if (gameRequest) {
            // Request contains the current Game, so we want to update it
            await applyRequestToGame(gameRequest, game);
            await game.save();
        } else {
            // Request doesn't contain the current Game, so it should be removed
            await game.remove();
        }
    }));
}

function formatResults(wins: number, losses: number, draws: number) {
    if (draws) {
        return `${wins}-${losses}-${draws}`;
    }

    return `${wins}-${losses}`;
}

export function calculateResultFromGames(games: Game[]) {
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
