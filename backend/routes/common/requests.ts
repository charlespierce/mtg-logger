export interface GameRequest {
    first_turn?: boolean;
    result?: number;
    final_turn?: number;
    sideboarded?: boolean;
    starting_hand?: number;
    pre_game_scry?: number;
    opponent_starting_hand?: number;
    opponent_pre_game_scry?: number;
    notes?: string;
}

export interface MatchRequest {
    opponent?: string;
    opponent_archetype?: string;
    notes?: string;
    match_date?: string;
}

export interface SessionRequest {
    title?: string;
    session_date?: string;
    archetype?: string;
    format?: string;
}
