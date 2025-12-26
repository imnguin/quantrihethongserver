import { userFunc } from '../function/user.js';

const search = async (req, res) => {
    const data = await userFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await userFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await userFunc.insert(req.body));
}

const update = async (req, res) => {
    res.send(await userFunc.update(req.body));
}

const deleted = async (req, res) => {
    res.send(await userFunc.deleted(req.body));
}

export const userController = {
    insert,
    search,
    update,
    deleted,
    load
}