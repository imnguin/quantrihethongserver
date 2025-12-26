import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const data = await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.get(collection, req));
    const items = await MongoData.withMongo('pm_item', (collection) => MongoData.get(collection, {}));
    const products = await MongoData.withMongo('pm_product', (collection) => MongoData.get(collection, {}));
    const dataMap = data.map((item) => {
        const itemInfo = items.find(i => i.itemid == item.itemid);
        const productInfo = products.find(p => p.productid == item.productid);
        return {
            ...item,
            itemname: itemInfo ? itemInfo.itemname : '',
            productname: productInfo ? productInfo.productname : ''
        };
    });
    return dataMap;
};

const load = async (req) => {
    const data = await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.findOne(collection, req));
    return data;
};

const insert = async (req) => {
    let objInsert;
    if (Array.isArray(req)) {
        objInsert = req.map((item) => ({ ...item, createdat: new Date() }));
    } else {
        objInsert = { ...req, createdat: new Date() };
    }
    await MongoData.withMongo('pm_item_exchange', (collection) =>
        MongoData.insert(collection, objInsert)
    );
    return true;
};

const update = async (req) => {
    const filter = { productid: req.productid, itemid: req.itemid };
    await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    const filter = { productid: req.productid, itemid: req.itemid };
    await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.deleted(collection, filter));
    return true;
};

const getCache = async (req) => {
    const data = await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.get(collection, {}));
    return data;
};

export const itemexchangeFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'itemexchangeFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'itemexchangeFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'itemexchangeFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'itemexchangeFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'itemexchangeFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'itemexchangeFunc.getCache')
};