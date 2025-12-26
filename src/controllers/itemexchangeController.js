import { itemexchangeFunc } from '../function/itemexchange.js';

const search = async (req, res) => {
    const data = await itemexchangeFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await itemexchangeFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await itemexchangeFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await itemexchangeFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await itemexchangeFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await itemexchangeFunc.getCache(req.body);
    res.send(data);
}

export const itemexchangeController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}