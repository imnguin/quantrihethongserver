import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const data = await MongoData.withMongo('pm_item', (collection) => MongoData.get(collection, req));
    const quantityunit = await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.get(collection, {}));
    const productsubgroup = await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.get(collection, {}));
    const dataMap = data.map(item => {
        const quantityunitInfo = quantityunit.find(q => q.quantityunitid == item.quantityunitid);
        const productsubgroupInfo = productsubgroup.find(p => p.productsubgroupid == item.productsubgroupid);
        return {
            ...item,
            quantityunitname: quantityunitInfo ? quantityunitInfo.quantityunitname : null,
            productsubgroupname: productsubgroupInfo ? productsubgroupInfo.productsubgroupname : null
        };
    });
    return dataMap;
};

const load = async (req) => {
    const data = await MongoData.withMongo('pm_item', (collection) => MongoData.findOne(collection, req));
    return data;
};

const insert = async (req) => {
    let objInsert;
    if (Array.isArray(req)) {
        objInsert = req.map((item) => ({ ...item, createdat: new Date() }));
    } else {
        objInsert = { ...req, createdat: new Date() };
    }
    await MongoData.withMongo('pm_item', (collection) =>
        MongoData.insert(collection, objInsert)
    );
    return true;
};

const update = async (req) => {
    const filter = { itemid: req.itemid };
    await MongoData.withMongo('pm_item', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    let filter = { itemid: req.itemid };
    if (Array.isArray(req)) {
        const itemids = req.map(i => i.itemid);
        filter.itemid = { $in: itemids };
        await MongoData.withMongo('pm_item', (collection) => MongoData.deleteMany(collection, filter));
    }
    else {
        await MongoData.withMongo('pm_item', (collection) => MongoData.deleted(collection, filter));
    }
    return true;
};

const getCache = async (req) => {
    const data = await MongoData.withMongo('pm_item', (collection) => MongoData.get(collection, {}));
    return data;
};

export const itemFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'itemFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'itemFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'itemFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'itemFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'itemFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'itemFunc.getCache')
};