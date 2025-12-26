import {google} from 'googleapis'
import credentials  from '../common/chatboxreact-6ec36-70936b302c75.json' assert { type: 'json' };
import { convert } from '../common/utils/convert.js';
import { withHandler } from "../middleware/withHandler.js";

const { client_email, private_key } = credentials;
const client = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

const spreadsheetId = '1TWtkND8yXYOG3DPMZGlSPoC2GjVWRl_q4x4GAz_AKk0';
const sheetName = 'data';

const getDataggSheet = async () => {
    try {
        await client.authorize();
        const sheets = google.sheets({ version: 'v4', auth: client });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: sheetName,
        });
        const rows = response.data.values;
        const data = convert(rows);
        if (data.length) {
            return data
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error accessing Google Sheets:', error);
        throw new Error(error.message);
    }
}

export const googleSheet = {
    getDataggSheet: withHandler(getDataggSheet, 'Lấy dữ liệu thành công!', 'Lỗi lấy dữ liệu', 'googleSheet.getDataggSheet')
}