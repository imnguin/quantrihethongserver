import { MongoData } from "../common/mongo.js";
import { genov } from "../common/utils/index.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";
import { itemstockbeginFunc } from "./itemstockbegin.js";
import { withHandler } from "../middleware/withHandler.js";

const search = async (req) => {
    const { outputvoucherid, fromdate = new Date(), todate = new Date() } = req;
    let filter = {
        createdat: {
            $gte: new Date(fromdate),
            $lte: new Date(todate)
        }
    };
    if (!!outputvoucherid) {
        filter = { outputvoucherid }
    }
    const data = await MongoData.withMongo('pm_outputvoucher', (collection) => MongoData.get(collection, filter));
    return data;
};

const load = async (req) => {
    const ovInfo = await MongoData.withMongo('pm_outputvoucher', (collection) => MongoData.findOne(collection, req));
    if (!ovInfo) {
        throw new Error('Không tìm thấy thông tin hóa đơn!');
    }
    const ovDTInfo = await MongoData.withMongo('pm_outputvoucher_detail', (collection) => MongoData.get(collection, req));
    return { ...ovInfo, outputvoucherdetail: ovDTInfo };
};

const insert = async (req) => {
    let objMaster = {
        outputvoucherid: `OV0001${genov()}`,
        createdat: new Date(),
        totalamount: req.reduce((sum, item) => sum + item.totalamount, 0),
        promotion: req.reduce((sum, item) => sum + item.promotion, 0),
        createduser: req[0].createduser
    }
    await MongoData.withMongo('pm_outputvoucher', (collection) =>
        MongoData.insert(collection, objMaster)
    );
    const items = await MongoData.withMongo('pm_item', (collection) => MongoData.get(collection, {}));
    const subgroups = await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.get(collection, {}));
    const exchanges = await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.get(collection, {}));
    let objInsertDetail;
    if (Array.isArray(req)) {
        objInsertDetail = req.map((item) => {
            const exchangeInfo = exchanges.find(ex => ex.productid == item?.productid);
            const itemInfo = items.find(i => i.itemid == exchangeInfo?.itemid);
            const subgroupInfo = subgroups.find(sg => sg.productsubgroupid == itemInfo?.productsubgroupid);

            return {
                ...item,
                outputvoucherid: objMaster.outputvoucherid,
                itemid: itemInfo ? itemInfo?.itemid : '',
                productsubgroupid: subgroupInfo ? subgroupInfo?.productsubgroupid : '',
                productsubgroupname: subgroupInfo ? subgroupInfo?.productsubgroupname : '',
                exchangequantity: exchangeInfo ? exchangeInfo?.exchangequantity : 0,
                createdat: new Date()
            }
        });
    } else {
        const exchangeInfo = exchanges.find(ex => ex.productid == req.productid);
        const itemInfo = items.find(i => i.itemid == exchangeInfo?.itemid);
        const subgroupInfo = subgroups.find(sg => sg.productsubgroupid == itemInfo?.productsubgroupid);
        objInsertDetail = {
            ...req,
            outputvoucherid: objMaster.outputvoucherid,
            itemid: itemInfo ? itemInfo?.itemid : '',
            productsubgroupid: subgroupInfo ? subgroupInfo?.productsubgroupid : '',
            productsubgroupname: subgroupInfo ? subgroupInfo?.productsubgroupname : '',
            exchangequantity: exchangeInfo ? exchangeInfo?.exchangequantity : 0,
            createdat: new Date()
        };
    }

    await MongoData.withMongo('pm_outputvoucher_detail', (collection) =>
        MongoData.insert(collection, objInsertDetail)
    );

    const today = new Date();
    await itemstockbeginFunc.calculatemonthlyrevenue({ months: today.getMonth() + 1 });
    return { outputvoucherid: objMaster.outputvoucherid };
};

const loadOutoutVoucherDetail = async (req) => {
    const { outputvoucherid, fromdate = new Date(), todate = new Date() } = req;
    let filter = {
        createdat: {
            $gte: new Date(fromdate),
            $lte: new Date(todate)
        }
    };
    if (!!outputvoucherid) {
        filter = { outputvoucherid }
    }
    const data = await MongoData.withMongo('pm_outputvoucher_detail', (collection) => MongoData.get(collection, filter));
    return data;
};

const deleted = async (req) => {
    let filter;
    if (Array.isArray(req)) {
        const outputvoucherids = req.map((item) => item.outputvoucherid);
        filter = { outputvoucherid: { $in: outputvoucherids } };
        await MongoData.withMongo('pm_outputvoucher', (collection) =>
            MongoData.deleteMany(collection, filter)
        );
        await MongoData.withMongo('pm_outputvoucher_detail', (collection) =>
            MongoData.deleteMany(collection, filter)
        );
    } else {
        filter = { outputvoucherid: req.outputvoucherid };
        await MongoData.withMongo('pm_outputvoucher', (collection) =>
            MongoData.deleted(collection, filter)
        );
        await MongoData.withMongo('pm_outputvoucher_detail', (collection) =>
            MongoData.deleted(collection, filter)
        );
    }
    return true;
};

export const outputvoucherFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'outputvoucherFunc.search'),
    insert: withHandler(insert, 'Tạo hóa đơn thành công!', 'Lỗi tạo mới hóa đơn', 'outputvoucherFunc.insert'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin!', 'outputvoucherFunc.load'),
    loadOutoutVoucherDetail: withHandler(loadOutoutVoucherDetail, 'Lấy chi tiết thành công!', 'Lỗi lấy chi tiết!', 'outputvoucherFunc.loadOutoutVoucherDetail'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi xóa', 'outputvoucherFunc.deleted')
};