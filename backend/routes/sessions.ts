import * as express from 'express';
import * as wrap from 'express-async-handler';

export const sessions = express.Router();

sessions.get('/', wrap(async (req, res) => {
}));

sessions.post('/', wrap(async (req, res) => {
}));

sessions.get('/:id', wrap(async (req, res) => {
}));

sessions.put('/:id', wrap(async (req, res) => {
}));
