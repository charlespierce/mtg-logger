-- Up
CREATE TABLE opponents (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE formats (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE archetypes (
    id INTEGER PRIMARY KEY,
    format_id INTEGER NOT NULL,
    name TEXT,
    FOREIGN KEY (format_id) REFERENCES formats(id)
    CONSTRAINT archetypes_uniqueness UNIQUE (format_id, name)
);

CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    format_id INTEGER,
    archetype_id INTEGER,
    session_date DATE,
    FOREIGN KEY (format_id) REFERENCES formats(id),
    FOREIGN KEY (archetype_id) REFERENCES archetypes(id)
);

CREATE TABLE matches (
    id INTEGER PRIMARY KEY,
    session_id INTEGER,
    format_id INTEGER NOT NULL,
    archetype_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    opponent_archetype_id INTEGER NOT NULL,
    notes TEXT,
    match_date DATE,
    FOREIGN KEY (session_id) REFERENCES sessions(id),
    FOREIGN KEY (format_id) REFERENCES formats(id),
    FOREIGN KEY (archetype_id) REFERENCES archetypes(id),
    FOREIGN KEY (opponent_id) REFERENCES opponents(id),
    FOREIGN KEY (opponent_archetype_id) REFERENCES archetypes(id)
);

CREATE TABLE games (
    id INTEGER PRIMARY KEY,
    match_id INTEGER NOT NULL,
    first_turn INTEGER,
    result INTEGER,
    final_turn INTEGER,
    sideboarded INTEGER,
    starting_hand_size INTEGER,
    pre_game_scry INTEGER,
    opponent_starting_hand_size INTEGER,
    opponent_pre_game_scry INTEGER,
    notes TEXT,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    CHECK (pre_game_scry = 0 OR starting_hand_size < 7),
    CHECK (opponent_pre_game_scry = 0 OR opponent_starting_hand_size < 7)
);

-- Down
DROP TABLE games;
DROP TABLE matches;
DROP TABLE sessions;
DROP TABLE archetypes;
DROP TABLE formats;
DROP TABLE opponents;
