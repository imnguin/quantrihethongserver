import { promotionFunc } from '../function/promotion.js';

const search = async (req, res) => {
    const data = await promotionFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await promotionFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await promotionFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await promotionFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await promotionFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await promotionFunc.getCache(req.body);
    res.send(data);
}

export const promotionController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}