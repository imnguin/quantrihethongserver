import { MongoData } from '../common/mongo.js';
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';

const search = async (req) => {
    const data = await MongoData.withMongo('pm_product', (collection) =>
        MongoData.get(collection, req)
    );
    return data;
};

const load = async (req) => {
    let productInfo;
    if (!!req.barcode) {
        const filter = { barcode: req.barcode }
        const barcodeInfo = await MongoData.withMongo('pm_product_lot', (collection) =>
            MongoData.findOne(collection, filter)
        );
        if (!!barcodeInfo) {
            productInfo = await MongoData.withMongo('pm_product', (collection) =>
                MongoData.findOne(collection, { productid: barcodeInfo.productid })
            );
            if (!!productInfo) {
                productInfo.barcode = barcodeInfo.barcode;
            }
        }
    } else if (!!req.productid) {
        const filter = { productid: req.productid }
        productInfo = await MongoData.withMongo('pm_product', (collection) =>
            MongoData.findOne(collection, filter)
        );
        if (!!productInfo) {
            const barcodeInfo = await MongoData.withMongo('pm_product_lot', (collection) =>
                MongoData.findOne(collection, filter)
            );
            if (!!barcodeInfo) {
                productInfo.barcode = barcodeInfo.barcode;
            }
        }
    }

    if (!productInfo) {
        return null;
    }

    const unitInfo = await MongoData.withMongo('pm_quantityunit', (collection) =>
        MongoData.findOne(collection, { quantityunitid: productInfo.quantityunitid })
    );
    const priceInfo = await MongoData.withMongo('pm_price', (collection) =>
        MongoData.findOne(collection, { productid: productInfo.productid })
    );
    const promotionInfo = await MongoData.withMongo('pm_promotion', (collection) =>
        MongoData.findOne(collection, { productid: productInfo.productid })
    );

    return {
        ...productInfo,
        quantityunitname: unitInfo ? unitInfo.quantityunitname : '',
        price: priceInfo ? priceInfo.price : 0,
        promotiontypeid: promotionInfo ? promotionInfo.promotiontypeid : null,
        salequantity: promotionInfo ? promotionInfo.salequantity : 0,
        promotionquantity: promotionInfo ? promotionInfo.promotionquantity : 0,
        applydatefrom: promotionInfo ? promotionInfo.applydatefrom : null,
        applydateto: promotionInfo ? promotionInfo.applydateto : null
    };
};

const insert = async (req) => {
    let objInsert;
    if (Array.isArray(req)) {
        objInsert = req.map((item) => ({ ...item, createdat: new Date() }));
    } else {
        objInsert = { ...req, createdat: new Date() };
    }
    await MongoData.withMongo('pm_product', (collection) =>
        MongoData.insert(collection, objInsert)
    );
    return true;
};

const update = async (req) => {
    const filter = { productid: req.productid };
    await MongoData.withMongo('pm_product', (collection) =>
        MongoData.update(collection, req, filter)
    );
    return true;
};

const deleted = async (req) => {
    let filter;
    if (Array.isArray(req)) {
        const productIds = req.map((item) => item.productid);
        filter = { productid: { $in: productIds } };
        await MongoData.withMongo('pm_product', (collection) =>
            MongoData.deleteMany(collection, filter)
        );
    } else {
        filter = { productid: req.productid };
        await MongoData.withMongo('pm_product', (collection) =>
            MongoData.deleted(collection, filter)
        );
    }
    return true;
};

const getCache = async (req) => {
    const data = await MongoData.withMongo('pm_product', (collection) => MongoData.get(collection, {}));
    return data;
};

export const productFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'productFunc.search'),
    insert: withHandler(insert, 'Thêm mới thành công', 'Lỗi thêm mới', 'productFunc.insert'),
    update: withHandler(update, 'Cập nhật thành công', 'Lỗi cập nhật', 'productFunc.update'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi xóa', 'productFunc.deleted'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'productFunc.load'),
    getCache: withHandler(getCache, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin', 'productFunc.getCache')
};