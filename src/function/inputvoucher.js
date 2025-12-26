import { MongoData } from "../common/mongo.js";
import { genov } from "../common/utils/index.js";
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const search = async (req) => {
    const { inputvoucherid, fromdate = new Date(), todate = new Date() } = req;
    let filter = {
        createdat: {
            $gte: new Date(fromdate),
            $lte: new Date(todate)
        }
    };
    if (!!inputvoucherid) {
        filter = { inputvoucherid }
    }
    return await MongoData.withMongo('pm_inputvoucher', (collection) => MongoData.get(collection, filter));
};

const load = async (req) => {
    const ivInfo = await MongoData.withMongo('pm_inputvoucher', (collection) => MongoData.findOne(collection, req));
    if (!ivInfo) {
        throw new Error('Không tìm thấy thông tin phiếu nhập!');
    }
    const ivDTInfo = await MongoData.withMongo('pm_inputvoucher_detail', (collection) => MongoData.get(collection, req));
    return { ...ivInfo, inputvoucherdetail: ivDTInfo };
};

const insert = async (req) => {
    let objMaster = {
        inputvoucherid: `IV0001${genov()}`,
        totalamount: req.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        createdat: new Date()
    }
    await MongoData.withMongo('pm_inputvoucher', (collection) =>
        MongoData.insert(collection, objMaster)
    );
    const items = await MongoData.withMongo('pm_item', (collection) => MongoData.get(collection, {}));
    const subgroups = await MongoData.withMongo('pm_product_subgroup', (collection) => MongoData.get(collection, {}));
    const exchanges = await MongoData.withMongo('pm_item_exchange', (collection) => MongoData.get(collection, {}));
    let objInsertDetail;
    if (Array.isArray(req)) {
        objMaster.createduser = req[0].createduser;
        objMaster.customerid = req[0].defaultcustomerid;
        objInsertDetail = req.map((item) => {
            delete item.defaultcustomerid;
            const exchangeInfo = exchanges.find(ex => ex.productid == item.productid);
            const itemInfo = items.find(i => i.itemid == exchangeInfo.itemid);
            const subgroupInfo = subgroups.find(sg => sg.productsubgroupid == itemInfo.productsubgroupid);

            return {
                ...item,
                inputvoucherid: objMaster.inputvoucherid,
                itemid: itemInfo ? itemInfo.itemid : '',
                productsubgroupid: subgroupInfo ? subgroupInfo.productsubgroupid : '',
                productsubgroupname: subgroupInfo ? subgroupInfo.productsubgroupname : '',
                exchangequantity: exchangeInfo ? exchangeInfo.exchangequantity : 0,
                createdat: new Date()
            }
        });
    } else {
        objMaster.createduser = req.createduser;
        objMaster.customerid = req.defaultcustomerid;
        const exchangeInfo = exchanges.find(ex => ex.productid == req.productid);
        const itemInfo = items.find(i => i.itemid == exchangeInfo.itemid);
        const subgroupInfo = subgroups.find(sg => sg.productsubgroupid == itemInfo.productsubgroupid);
        delete req.defaultcustomerid;
        objInsertDetail = {
            ...req,
            inputvoucherid: objMaster.inputvoucherid,
            itemid: itemInfo ? itemInfo.itemid : '',
            productsubgroupid: subgroupInfo ? subgroupInfo.productsubgroupid : '',
            productsubgroupname: subgroupInfo ? subgroupInfo.productsubgroupname : '',
            exchangequantity: exchangeInfo ? exchangeInfo.exchangequantity : 0,
            createdat: new Date()
        };
    }
    await MongoData.withMongo('pm_inputvoucher_detail', (collection) =>
        MongoData.insert(collection, objInsertDetail)
    );
    return { inputvoucher: objMaster.inputvoucherid };
};

const deleted = async (req) => {
    let filter;
    if (Array.isArray(req)) {
        const inputvoucherids = req.map((item) => item.inputvoucherid);
        filter = { inputvoucherid: { $in: inputvoucherids } };
        await MongoData.withMongo('pm_inputvoucher', (collection) =>
            MongoData.deleteMany(collection, filter)
        );
        await MongoData.withMongo('pm_inputvoucher_detail', (collection) =>
            MongoData.deleteMany(collection, filter)
        );
    } else {
        filter = { inputvoucherid: req.inputvoucherid };
        await MongoData.withMongo('pm_inputvoucher', (collection) =>
            MongoData.deleted(collection, filter)
        );
        await MongoData.withMongo('pm_inputvoucher_detail', (collection) =>
            MongoData.deleted(collection, filter)
        );
    }
    return true;
};

const loadInputVoucherDetail = async (req) => {
    const { inputvoucherid, fromdate = new Date(), todate = new Date() } = req;
    let filter = {
        createdat: {
            $gte: new Date(fromdate),
            $lte: new Date(todate)
        }
    };
    if (!!inputvoucherid) {
        filter = { inputvoucherid }
    }
    const data = await MongoData.withMongo('pm_inputvoucher_detail', (collection) => MongoData.get(collection, filter));
    return data;
};

export const inputvoucherFunc = {
    search: withHandler(search, 'Lấy danh sách thành công', 'Lỗi lấy danh sách', 'inputvoucherFunc.search'),
    insert: withHandler(insert, 'Tạo phiếu nhập thành công!', 'Lỗi tạo mới phiếu nhập', 'inputvoucherFunc.insert'),
    load: withHandler(load, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin!', 'inputvoucherFunc.load'),
    deleted: withHandler(deleted, 'Xóa thành công', 'Lỗi xóa', 'inputvoucherFunc.deleted'),
    loadInputVoucherDetail: withHandler(loadInputVoucherDetail, 'Lấy danh sách thành công!', 'Lỗi lấy thông tin báo cáo!', 'inputvoucherFunc.loadInputVoucherDetail')
};