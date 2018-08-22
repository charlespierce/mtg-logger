export interface GameResponse {
    id: number;
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

export interface MatchDetailResponse {
    id: number;
    opponent?: string;
    opponent_archetype?: string;
    notes?: string;
    match_date?: string;
    games: GameResponse[];
}

export interface MatchSummaryResponse {
    id: number;
    opponent?: string;
    opponent_archetype?: string;
    result: string;
}

export interface SessionResponse {
    id: number;
    title?: string;
    session_date?: string;
    archetype?: string;
    format?: string;
    matchCount: number;
}