// common/withHandler.js
import { MongoData } from "../common/mongo.js";
import apiresult from "../model/apiresult.js";

export const withHandler = (fn, successMsg, errorMsg, context = "") => async (req) => {
    try {
        const data = await fn(req);
        return new apiresult(false, successMsg, successMsg, data);
    } catch (error) {
        await logError(error, context, req);
        return new apiresult(true, errorMsg, error.message);
    }
};

export const logError = async (error, context = "", req = null) => {
    const time = new Date();

    const logEntry = {
        time,
        context,
        message: error.message,
        stack: error.stack,
        params: req
    };
    try {
        await MongoData.withMongo("pm_logError", (collection) =>
            MongoData.insert(collection, logEntry)
        );
    } catch (logErr) {
        console.error("Failed to write error log to Mongo:", logErr.message);
    }
};
