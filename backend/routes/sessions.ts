import * as express from 'express';
import * as wrap from 'express-async-handler';
import { Archetype } from '../entities/archetype';
import { Format } from '../entities/format';
import { Session } from '../entities/session';

interface SessionRequest {
    title: string;
    session_date?: string;
    archetype?: string;
    format?: string;
}

interface SessionResponse extends SessionRequest {
    id: number;
    matchCount: number;
}

function mapSessionToResponse(session: Session): SessionResponse {
    return {
        id: session.id,
        title: session.title,
        session_date: session.session_date && session.session_date.toLocaleDateString('en-US'),
        archetype: session.archetype && session.archetype.name,
        format: session.format && session.format.name,
        matchCount: session.matches ? session.matches.length + 1 : 0
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
            session.format = format;

            if (request.archetype) {
                session.archetype = await Archetype.findOrCreate(format, request.archetype);
            }
        }
    }
}

export const router = express.Router();

router.get('/', wrap(async (req, res) => {
    const sessions = await Session.find({
        relations: ['archetype', 'format', 'matches'],
        order: {
            session_date: 'DESC'
        }
    });

    res.send(JSON.stringify(sessions.map(mapSessionToResponse)));
}));

router.post('/', wrap(async (req, res) => {
    const session = new Session();

    await applyRequestToSession(req.body, session);
    await session.save();

    res.status(201)
        .send(JSON.stringify(mapSessionToResponse(session)));
}));

router.get('/:id', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.id);

    if (session) {
        res.send(JSON.stringify(mapSessionToResponse(session)));
    } else {
        res.sendStatus(404);
    }
}));

router.put('/:id', wrap(async (req, res) => {
    const session = await Session.findOne(req.params.id);

    if (session) {
        await applyRequestToSession(req.body, session);
        await session.save();

        res.send(JSON.stringify(mapSessionToResponse(session)));
    } else {
        res.sendStatus(404);
    }
}));
