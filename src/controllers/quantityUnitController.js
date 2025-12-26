import { quantityUnitFunc } from '../function/quantityUnit.js';

const search = async (req, res) => {
    const data = await quantityUnitFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await quantityUnitFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await quantityUnitFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await quantityUnitFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await quantityUnitFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await quantityUnitFunc.getCache(req.body);
    res.send(data);
}

export const quantityUnitController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}