import { productFunc } from '../function/product.js';

const search = async (req, res) => {
    const data = await productFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await productFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await productFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await productFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await productFunc.deleted(req.body));
}
const getCache = async (req, res) => {
    const data = await productFunc.getCache(req.body);
    res.send(data);
}
export const productController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}