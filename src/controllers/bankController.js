import { bankFunc } from '../function/bank.js';

const search = async (req, res) => {
    const data = await bankFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await bankFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await bankFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await bankFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await bankFunc.deleted(req.body));
}

const getCache = async (req, res) => {
    const data = await bankFunc.getCache(req.body);
    res.send(data);
}

export const bankController = {
    insert,
    search,
    update,
    deleted,
    load,
    getCache
}