import { Router } from 'express';
import * as wrap from 'express-async-handler';
import { SessionRequest } from './common/requests';
import { SessionResponse } from './common/responses';
import { Session, SessionUpdateProperties } from '../entities/session';

async function buildResponse(session: Session): Promise<SessionResponse> {
    return {
        id: session.id,
        title: session.title,
        archetype: session.archetype,
        format: session.format,
        session_date: session.session_date && session.session_date.toLocaleDateString('en-US'),
        matchCount: (await session.matches).length
    };
}

function buildUpdater(request: SessionRequest): Pick<Session, SessionUpdateProperties> {
    return {
        ...request,
        session_date: request.session_date && new Date(request.session_date) || undefined
    };
}

export const router = Router();

router.get('/sessions', wrap(async (req, res) => {
    const sessions = await Session.find({
        relations: ['matches']
    });

    const response = await Promise.all(sessions.map(buildResponse));
    res.send(JSON.stringify(response));
}));

router.post('/sessions', wrap(async (req, res) => {
    const session = new Session();
    await session.save();

    const response = await buildResponse(session);
    res.send(JSON.stringify(response));
}));

router.get('/sessions/:id', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.id, {
        relations: ['matches']
    });

    if (session) {
        const response = await buildResponse(session);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.put('/sessions/:id', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.id, {
        relations: ['matches']
    });

    if (session) {
        Object.assign(session, buildUpdater(req.body));
        await session.save();

        const response = await buildResponse(session);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.delete('/sessions/:id', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.id);

    if (session) {
        await session.remove();
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}));
