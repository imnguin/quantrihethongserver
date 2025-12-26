import { hashMD5 } from "../common/MD5.js";
import apiresult from "../model/apiresult.js";
import { userFunc } from "./user.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const login = async (req) => {
    const { username, password } = req;
    const user = await userFunc.load({ username });
    if (!user.iserror) {
        if (user.resultObject) {
            if (hashMD5(password) == user.resultObject.password) {
                const accessToken = genarateAccessToken(user.resultObject);
                const refreshToken = genarateRefreshToken(user.resultObject);
                const result = {
                    ...user.resultObject,
                    accessToken,
                    refreshToken
                };
                delete result.password;
                return new apiresult(false, 'Đăng nhập thành công!', 'Đăng nhập thành công!', result);
            } else {
                return new apiresult(true, 'Đăng nhập không thành công!', 'Sai mật khẩu');
            }
        } else {
            return new apiresult(true, 'Đăng nhập không thành công!', 'User name không tồn tại');
        }
    }
}

const refeshToken = async (req) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) {
            return new apiresult(true, 'Refresh token không tồn tại!', 'Vui lòng đăng nhập lại.', null, 401);
        }

        const user = jwt.verify(token, process.env.JWT_REFESH_KEY);
        const newAccessToken = genarateAccessToken(user);
        const newRefreshToken = genarateRefreshToken(user);

        return new apiresult(false, 'Refresh token thành công!', 'Ok', {
            ...user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        return new apiresult(true, 'Refresh token thất bại!', error.message, null, 401);
    }
};

const genarateAccessToken = (user) => {
    const accessToken = jwt.sign({
        username: user.username,
        email: user.email
    },
        process.env.JWT_ACCESS_KEY,
        {
            expiresIn: '1d'
        });

    return accessToken;
}

const genarateRefreshToken = (user) => {
    const dataSigin = {
        username: user.username,
        email: user.email
    };
    const refeshToken = jwt.sign(
        dataSigin,
        process.env.JWT_REFESH_KEY,
        {
            expiresIn: '15d'
        }
    );
    return refeshToken;
}

export const authenFunc = {
    login,
    refeshToken
}