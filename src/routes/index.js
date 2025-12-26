import { areaRouter } from "./area.js";
import { authenRouter } from "./authen.js";
import { bankRouter } from "./bank.js";
import { branchRouter } from "./branch.js";
import { brandRouter } from "./brand.js";
import { customerRouter } from "./customer.js";
import { inputvoucherrouter } from "./inputvoucher.js";
import { itemRouter } from "./item.js";
import { itemexchangeRouter } from "./itemexchange.js";
import { itemstockbeginRouter } from "./itemstockbegin.js";
import { outputvoucherRouter } from "./outputvoucher.js";
import { priceRouter } from "./price.js";
import { productRouter } from "./product.js";
import { product_lotRouter } from "./product_lot.js";
import { productsubgroupRouter } from "./productsubgroup.js";
import { promotionRouter } from "./promotion.js";
import { quantityUnitRouter } from "./quantityUnit.js";
import { userRouter } from "./user.js";

export const Routers = [
    itemstockbeginRouter,
    itemexchangeRouter,
    itemRouter,
    productsubgroupRouter,
    bankRouter,
    inputvoucherrouter,
    customerRouter,
    promotionRouter,
    outputvoucherRouter,
    product_lotRouter,
    priceRouter,
    areaRouter,
    brandRouter,
    branchRouter,
    quantityUnitRouter,
    productRouter,
    userRouter,
    authenRouter
];