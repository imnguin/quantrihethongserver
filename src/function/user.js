import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { hashMD5 } from "../common/MD5.js";
import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";

const search = async (req) => {
    const data = await MongoData.withMongo('system_user', (collection) => MongoData.get(collection, req));
    return data;
};

const load = async (req) => {
    const data = await MongoData.withMongo('system_user', (collection) => MongoData.findOne(collection, req));
    return data;
};

const insert = async (req) => {
    let user = { ...req, createdat: new Date(), password: hashMD5('123456') };
    // Tạo bí mật TOTP
    const secret = speakeasy.generateSecret({
        name: `YourApp:${user.username}`,
        issuer: 'YourApp'
    });
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    user.secret = secret.base32;
    user.qrcodeurl = qrCodeUrl;
    await MongoData.withMongo('system_user', (collection) => MongoData.insert(collection, user));
    return true;
};

const update = async (req) => {
    const filter = { username: req.username };
    await MongoData.withMongo('system_user', (collection) => MongoData.update(collection, req, filter));
    return true;
};

const deleted = async (req) => {
    const filter = { username: req.username };
    await MongoData.withMongo('system_user', (collection) => MongoData.deleted(collection, filter));
    return true;
};

export const userFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'userFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'userFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'userFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi Xóa', 'userFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'userFunc.load')
};