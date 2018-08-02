import * as express from 'express';
import * as wrap from 'express-async-handler';

export const formats = express.Router();

formats.get('/', wrap(async (req, res) => {
}));
