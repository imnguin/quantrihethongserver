import { brandFunc } from '../function/brand.js';

const search = async (req, res) => {
    const data = await brandFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await brandFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await brandFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await brandFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await brandFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await brandFunc.getCache(req.body);
    res.send(data);
}

export const brandController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}