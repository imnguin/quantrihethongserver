import { priceFunc } from '../function/price.js';

const search = async (req, res) => {
    const data = await priceFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await priceFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await priceFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await priceFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await priceFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await priceFunc.getCache(req.body);
    res.send(data);
}

export const priceController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}