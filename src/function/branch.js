import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    return await MongoData.withMongo('pm_branch', (collection) => MongoData.get(collection, req));
};

const load = async (req) => {
    return await MongoData.withMongo('pm_branch', (collection) => MongoData.findOne(collection, req));
};

const insert = async (req) => {
    const user = { ...req, ...baseItem };
    user.createdat = new Date();
    await MongoData.withMongo('pm_branch', (collection) => MongoData.insert(collection, user));
    return true;
};

const update = async (req) => {
    const filter = { branchid: req.branchid };
    await MongoData.withMongo('pm_branch', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    const filter = { branchid: req.branchid };
    await MongoData.withMongo('pm_branch', (collection) => MongoData.deleted(collection, filter));
    return true;
};

const getCache = async (req) => {
    return await MongoData.withMongo('pm_branch', (collection) => MongoData.get(collection, {}));
};

export const branchFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'branchFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'branchFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'branchFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'branchFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'branchFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'branchFunc.getCache')
};