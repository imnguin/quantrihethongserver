import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const data = await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.get(collection, req));
    return data;
};

const load = async (req) => {
    const data = await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.findOne(collection, req));
    return data;
};

const insert = async (req) => {
    const user = { ...req, ...baseItem };
    user.createdat = new Date();
    await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.insert(collection, user));
    return true;
};

const update = async (req) => {
    const filter = { quantityunitid: req.quantityunitid };
    await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    const filter = { quantityunitid: req.quantityunitid };
    await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.deleted(collection, filter));
    return true;
};

const getCache = async (req) => {
    const data = await MongoData.withMongo('pm_quantityunit', (collection) => MongoData.get(collection, {}));
    return data;
};

export const quantityUnitFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'quantityUnitFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'quantityUnitFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'quantityUnitFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'quantityUnitFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'quantityUnitFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'quantityUnitFunc.getCache')
};