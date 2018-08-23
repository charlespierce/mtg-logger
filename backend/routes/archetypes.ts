import { Router } from 'express';
import * as wrap from 'express-async-handler';
import { getConnection } from 'typeorm';

export const router = Router();

type ArchetypeResult = { archetype: string };

function getArchetype(result: ArchetypeResult) {
    return result.archetype;
}

router.get('/archetypes', wrap(async (req, res) => {
    const connection = getConnection();
    const queryString = `SELECT archetype FROM session
                         WHERE archetype IS NOT NULL
                         UNION
                         SELECT opponent_archetype FROM match
                         WHERE opponent_archetype IS NOT NULL`;
    const results: ArchetypeResult[] = await connection.query(queryString);

    res.send(JSON.stringify(results.map(getArchetype)));
}));

router.get('/archetypes/:format', wrap(async (req, res) => {
    const connection = getConnection();
    const format = req.params.format;
    const queryString = `SELECT archetype FROM session
                         WHERE format = ?1
                         AND archetype IS NOT NULL
                         UNION
                         SELECT match.opponent_archetype FROM match
                         INNER JOIN session ON session.id = match.sessionId
                         WHERE session.format = ?1
                         AND match.opponent_archetype IS NOT NULL`;
    const results: ArchetypeResult[] = await connection.query(queryString, [format]);

    res.send(JSON.stringify(results.map(getArchetype)));
}));
