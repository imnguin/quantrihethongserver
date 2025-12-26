import { productsubgroupFunc } from "../function/productsubgroup.js";

const search = async (req, res) => {
    const data = await productsubgroupFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await productsubgroupFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await productsubgroupFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await productsubgroupFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await productsubgroupFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await productsubgroupFunc.getCache(req.body);
    res.send(data);
}

export const productsubgroupController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}