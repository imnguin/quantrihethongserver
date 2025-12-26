import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const data = await MongoData.withMongo('pm_product_lot', (collection) => MongoData.get(collection, req));
    return data;
};

const load = async (req) => {
    const data = await MongoData.withMongo('pm_product_lot', (collection) => MongoData.findOne(collection, req));
    return data;
};

const insert = async (req) => {
    let objInsert;
    if (Array.isArray(req)) {
        objInsert = req.map((item) => ({ ...item, createdat: new Date() }));
    } else {
        objInsert = { ...req, createdat: new Date() };
    }
    await MongoData.withMongo('pm_product_lot', (collection) =>
        MongoData.insert(collection, objInsert)
    );
    return true;
};

const update = async (req) => {
    const filter = { productid: req.productid, barcode: req.barcode };
    await MongoData.withMongo('pm_product_lot', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    const filter = { productid: req.productid, barcode: req.barcode };
    await MongoData.withMongo('pm_product_lot', (collection) => MongoData.deleted(collection, filter));
    return true;
};

const getCache = async (req) => {
    const data = await MongoData.withMongo('pm_product_lot', (collection) => MongoData.get(collection, {}));
    return data;
};

export const product_lotFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'product_lotFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'product_lotFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'product_lotFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'product_lotFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'product_lotFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'product_lotFunc.getCache')
};