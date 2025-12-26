import { product_lotFunc } from '../function/product_lot.js';

const search = async (req, res) => {
    const data = await product_lotFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await product_lotFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await product_lotFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await product_lotFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await product_lotFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await product_lotFunc.getCache(req.body);
    res.send(data);
}

export const product_lotController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}