import { itemstockbeginFunc } from "../function/itemstockbegin.js";

const updateItemStock = async (req, res) => {
    const data = await itemstockbeginFunc.updateItemStock(req.body);
    res.send(data);
}

const calculate = async (req, res) => {
    const data = await itemstockbeginFunc.calculate();
    res.send(data);
}

const calculatemonthlyrevenue = async (req, res) => {
    const data = await itemstockbeginFunc.calculatemonthlyrevenue(req.body);
    res.send(data);
}

const getall = async (req, res) => {
    const data = await itemstockbeginFunc.getall(req.body);
    res.send(data);
}

export const itemstockbeginController = {
    updateItemStock,
    calculate,
    calculatemonthlyrevenue,
    getall
};