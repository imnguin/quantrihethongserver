import { areaFunc } from '../function/area.js';

const search = async (req, res) => {
    const data = await areaFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await areaFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await areaFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await areaFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await areaFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await areaFunc.getCache(req.body);
    res.send(data);
}

export const areaController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}