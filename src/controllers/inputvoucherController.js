import { inputvoucherFunc } from '../function/inputvoucher.js';
const search = async (req, res) => {
    const data = await inputvoucherFunc.search(req.body);
    res.send(data);
}

const load = async (req, res) => {
    const data = await inputvoucherFunc.load(req.body);
    res.send(data);
}

const insert = async (req, res) => {
    res.send(await inputvoucherFunc.insert(req.body));
}
const deleted = async (req, res) => {
    res.send(await inputvoucherFunc.deleted(req.body));
}

const loadInputVoucherDetail = async (req, res) => {
    const data = await inputvoucherFunc.loadInputVoucherDetail(req.body);
    res.send(data);
}

export const inputvoucherController = {
    search,
    insert,
    load,
    deleted,
    loadInputVoucherDetail
}