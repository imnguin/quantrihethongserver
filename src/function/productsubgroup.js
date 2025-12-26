import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const data = await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.get(collection, req));
    return data;
};

const load = async (req) => {
    const data = await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.findOne(collection, req));
    return data;
};

const insert = async (req) => {
    let objInsert;
    if (Array.isArray(req)) {
        objInsert = req.map((item) => ({ ...item, createdat: new Date() }));
    } else {
        objInsert = { ...req, createdat: new Date() };
    }
    await MongoData.withMongo('pm_product_subgroup', (collection) =>
        MongoData.insert(collection, objInsert)
    );
    return true;
};

const update = async (req) => {
    const filter = { productid: req.productid };
    await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    const filter = { productid: req.productid };
    await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.deleted(collection, filter));
    return true;
};

const getCache = async (req) => {
    const data = await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.get(collection, {}));
    return data;
};

export const productsubgroupFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'productsubgroupFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'productsubgroupFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'productsubgroupFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'productsubgroupFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'productsubgroupFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'productsubgroupFunc.getCache')
};