import { MongoData } from "../common/mongo.js";
import { withHandler } from "../middleware/withHandler.js";
import apiresult from '../model/apiresult.js';
import { baseItem } from "../model/baseItem.js";

const updateItemStock = async (req) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const query = {
            createdat: { $gte: startOfDay, $lte: endOfDay }
        };

        const outputvoucherdetails = await MongoData.withMongo(
            'pm_outputvoucher_detail',
            (collection) => MongoData.get(collection, query)
        );

        const inputvoucherdetails = await MongoData.withMongo(
            'pm_inputvoucher_detail',
            (collection) => MongoData.get(collection, query)
        );

        // Today & yesterday string
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);

        // Get item stock begin
        const filter = { datekey: { $in: [yesterdayStr, todayStr] } };
        const itemStocks = await MongoData.withMongo(
            'pm_itemstockbegin',
            (collection) => MongoData.get(collection, filter)
        );

        // Nếu hôm nay đã có thì xóa để insert lại
        if (itemStocks && itemStocks.length > 0) {
            const checkDate = itemStocks.filter(item => item.datekey == todayStr);
            if (checkDate.length > 0) {
                await MongoData.withMongo(
                    'pm_itemstockbegin',
                    (collection) => MongoData.deleteMany(collection, { datekey: todayStr })
                );
            }
        }

        // Xử lý tồn kho theo itemid
        const uniqueItemIds = [...new Set(outputvoucherdetails.filter(x => !!x.itemid).map(x => x.itemid))];
        const items = await MongoData.withMongo(
            'pm_item',
            (collection) => MongoData.get(collection, {})
        );
        for (const itemId of uniqueItemIds) {
            const outputDetails = outputvoucherdetails.filter(x => x.itemid == itemId);
            const inputDetails = inputvoucherdetails.filter(x => x.itemid == itemId);

            const totalOutputQuantity = outputDetails.reduce(
                (sum, d) => sum + ((d.exchangequantity || 0) * (d.quantity || 0)), 0
            );
            const totalInputQuantity = inputDetails.reduce(
                (sum, d) => sum + (d.quantity || 0), 0
            );

            const openingstock = itemStocks.find(x => x.itemid == itemId && x.datekey == yesterdayStr);
            const openingstockQuantity = openingstock ? openingstock.quantity : 0;

            const closingstock = openingstockQuantity + totalInputQuantity - totalOutputQuantity;
            const itemInfo = items.find(x => x.itemid == itemId);
            const objInsert = {
                itemid: itemId,
                itemname: itemInfo?.itemname,
                quantityunitid: itemInfo?.quantityunitid,
                datekey: todayStr,
                quantitystock: closingstock,
                quantityinput: totalInputQuantity,
                quantityoutput: totalOutputQuantity,
                createdat: new Date()
            };

            await MongoData.withMongo(
                'pm_itemstockbegin',
                (collection) => MongoData.insert(collection, objInsert)
            );
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

const calculate = async () => {
    try {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setDate(today.getDate() - 1);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const query = {
            createdat: { $gte: startOfDay, $lte: endOfDay }
        };

        const outputvouchers = await MongoData.withMongo('pm_outputvoucher', (collection) => MongoData.get(collection, query));

        // Today & yesterday string
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const todayStr = formatDateVN(today);
        const yesterdayStr = formatDateVN(yesterday);

        const totalRevenue = outputvouchers.filter(x => formatDateVN(x.createdat) === todayStr).reduce((sum, d) => sum + (d.totalamount || 0), 0);
        const totalOrders = outputvouchers.filter(x => formatDateVN(x.createdat) === todayStr).length;
        const totalRevenueYesterday = outputvouchers.filter(x => formatDateVN(x.createdat) === yesterdayStr).reduce((sum, d) => sum + (d.totalamount || 0), 0);
        const totalOrdersYesterday = outputvouchers.filter(x => formatDateVN(x.createdat) === yesterdayStr).length;

        const monthday = today.getMonth() + 1;
        const monthyear = today.getFullYear();

        let monthsfilter = [];
        for (let i = 1; i <= monthday; i++) {
            const month = i < 10 ? `0${i}` : `${i}`;
            monthsfilter.push(`${month}-${monthyear}`);
        }

        const monthlyrevenues = await MongoData.withMongo('pm_monthlyrevenue', (collection) => MongoData.get(collection, { month: { $in: monthsfilter } }));
        let monthlyRevenue = [];
        for (let i = 1; i <= monthday; i++) {
            const month = `Tháng ${i}`;
            const m = i < 10 ? `0${i}` : `${i}`;
            const check = monthlyrevenues.find(x => x.month === `${m}-${monthyear}`);
            monthlyRevenue.push({ month, revenue: toMilion(check?.revenue) });
        }
        const response = {
            totalRevenue,
            totalOrders,
            orderChange: totalOrdersYesterday === 0 || totalOrders - totalOrdersYesterday === 0 ? 0 : ((totalOrders - totalOrdersYesterday) / totalOrdersYesterday) * 100,
            revenueChange: totalRevenueYesterday === 0 || totalRevenue - totalRevenueYesterday === 0 ? 0 : ((totalRevenue - totalRevenueYesterday) / totalRevenueYesterday) * 100,
            monthlyRevenue,
            inventory: [
                { key: '1', name: 'Sữa tươi', stock: 100, change: 20, changePercent: 25 },
                { key: '2', name: 'Bánh mì', stock: 50, change: -10, changePercent: -17 },
                { key: '3', name: 'Nước ngọt', stock: 200, change: 30, changePercent: 18 },
                { key: '4', name: 'Bánh quy', stock: 30, change: -5, changePercent: -14 },
            ],
        }
        return response;
    }
    catch (error) {
        throw new Error(error.message);
    }
};

const calculatemonthlyrevenue = async (req) => {
    try {
        const TZ = 'Asia/Ho_Chi_Minh';
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        let targetMonth = Number(req?.months);
        const isSingleMonth =
            Number.isInteger(targetMonth) && targetMonth >= 1 && targetMonth <= 12;

        const result = await MongoData.withMongo('pm_outputvoucher', async (vouchersCollection) => {
            // $match theo NĂM/THÁNG local VN, không dùng khoảng thời gian UTC
            const matchStage = isSingleMonth
                ? {
                    $match: {
                        $expr: {
                            $let: {
                                vars: { p: { $dateToParts: { date: '$createdat', timezone: TZ } } },
                                in: {
                                    $and: [
                                        { $eq: ['$$p.year', currentYear] },
                                        { $eq: ['$$p.month', targetMonth] },
                                    ],
                                },
                            },
                        },
                    },
                }
                : {
                    $match: {
                        $expr: {
                            $let: {
                                vars: { p: { $dateToParts: { date: '$createdat', timezone: TZ } } },
                                in: {
                                    $and: [
                                        { $eq: ['$$p.year', currentYear] },
                                        { $lte: ['$$p.month', currentMonth] }, // YTD đến hết tháng hiện tại (giờ VN)
                                    ],
                                },
                            },
                        },
                    },
                };

            const pipeline = [
                matchStage,
                // Tách phần năm/tháng theo giờ VN để group
                {
                    $set: {
                        parts: { $dateToParts: { date: '$createdat', timezone: TZ } },
                    },
                },
                {
                    $group: {
                        _id: { year: '$parts.year', month: '$parts.month' },
                        revenue: { $sum: '$totalamount' },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        createdat: {
                            // mốc đầu tháng theo giờ VN (trả về Date UTC tương ứng)
                            $dateFromParts: { year: '$_id.year', month: '$_id.month', day: 1, timezone: TZ },
                        },
                        month: {
                            // Nhãn MM-YYYY theo giờ VN
                            $dateToString: {
                                format: '%m-%Y',
                                date: { $dateFromParts: { year: '$_id.year', month: '$_id.month', day: 1, timezone: TZ } },
                                timezone: TZ,
                            },
                        },
                        revenue: 1,
                    },
                },
                { $sort: { createdat: 1 } }, // sort đúng theo thời gian thực
            ];

            const monthlyRevenue = await vouchersCollection.aggregate(pipeline).toArray();

            // Upsert sang pm_monthlyrevenue theo key month (MM-YYYY)
            await MongoData.withMongo('pm_monthlyrevenue', async (monthlyRevenueCollection) => {
                for (const r of monthlyRevenue) {
                    await MongoData.update(
                        monthlyRevenueCollection,
                        { revenue: r.revenue, createdat: r.createdat },
                        { month: r.month },
                        true
                    );
                }
            });

            return monthlyRevenue;
        });

        return result;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getall = async (req) => {
    try {
        const data = await MongoData.withMongo('pm_itemstockbegin', (collection) => MongoData.get(collection, {}));
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

const formatDate = (date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

const toMilion = (num) => {
    if (!num || isNaN(num)) return 0;
    return num / 1000000;
};

const formatDateVN = (date) => {
    return date.toLocaleDateString("en-GB", { timeZone: "Asia/Ho_Chi_Minh" })
        .split("/").join("-");
    // ra dạng dd-mm-yyyy
};

export const itemstockbeginFunc = {
    updateItemStock: withHandler(updateItemStock, 'Cập nhật trừ tồn thành công!', 'Lỗi cập nhật tồn!', 'itemstockbeginFunc.updateItemStock'),
    calculate: withHandler(calculate, 'Tính toán thành công!', 'Lỗi tính toán!', 'itemstockbeginFunc.calculate'),
    calculatemonthlyrevenue: withHandler(calculatemonthlyrevenue, 'Tính doanh thu tháng thành công!', 'Lỗi tính doanh thu tháng!', 'itemstockbeginFunc.calculatemonthlyrevenue'),
    getall: withHandler(getall, 'Lấy thông tin thành công!', 'Lỗi lấy thông tin!', 'itemstockbeginFunc.getall')
};