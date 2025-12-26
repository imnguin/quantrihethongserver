import { itemFunc } from "../function/item.js";

const search = async (req, res) => {
    const data = await itemFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await itemFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await itemFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await itemFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await itemFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await itemFunc.getCache(req.body);
    res.send(data);
}

export const itemController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}