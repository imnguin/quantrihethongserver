import { customerFunc } from '../function/customer.js';

const search = async (req, res) => {
    const data = await customerFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await customerFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await customerFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await customerFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await customerFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await customerFunc.getCache(req.body);
    res.send(data);
}

export const customerController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}