import { branchFunc } from '../function/branch.js';

const search = async (req, res) => {
    const data = await branchFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await branchFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await branchFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await branchFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await branchFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await branchFunc.getCache(req.body);
    res.send(data);
}

export const branchController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}