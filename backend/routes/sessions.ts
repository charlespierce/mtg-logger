import * as express from 'express';
import * as wrap from 'express-async-handler';
import { SessionRequest } from './common/requests';
import { SessionResponse } from './common/responses';
import { Archetype } from '../entities/archetype';
import { Format } from '../entities/format';
import { Session } from '../entities/session';

async function mapSessionToResponse(session: Session): Promise<SessionResponse> {
    const archetype = await session.archetype;
    const format = await session.format;
    const matches = await session.matches;

    return {
        id: session.id,
        title: session.title,
        session_date: session.session_date && session.session_date.toLocaleDateString('en-US'),
        archetype: archetype && archetype.name,
        format: format && format.name,
        matchCount: matches ? matches.length : 0
    };
}

async function applyRequestToSession(request: SessionRequest, session: Session) {
    session.title = request.title;

    if (request.session_date) {
        session.session_date = new Date(request.session_date);
    }

    if (request.format) {
        const format = await Format.findOne(request.format);

        if (format) {
            session.format = Promise.resolve(format);

            if (request.archetype) {
                session.archetype = Archetype.findOrCreate(format, request.archetype);
            }
        }
    }
}

export const router = express.Router();

router.get('/sessions', wrap(async (req, res) => {
    const sessions = await Session.find({
        relations: ['archetype', 'format', 'matches'],
        order: { session_date: 'DESC' }
    });

    const response = await Promise.all(sessions.map(mapSessionToResponse));
    res.send(JSON.stringify(response));
}));

router.post('/sessions', wrap(async (req, res) => {
    const request: SessionRequest = req.body
    const session = new Session();

    await applyRequestToSession(request, session);
    await session.save();

    res.sendStatus(201);
}));

router.get('/sessions/:id', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.id, {
        relations: ['archetype', 'format', 'matches']
    });

    if (session) {
        const response = await mapSessionToResponse(session);
        res.send(JSON.stringify(response));
    } else {
        res.sendStatus(404);
    }
}));

router.put('/sessions/:id', wrap(async (req, res) => {
    const request: SessionRequest = req.body;
    const session = await Session.findOne(req.params.id);

    if (session) {
        await applyRequestToSession(request, session);
        await session.save();

        res.sendStatus(204);
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
