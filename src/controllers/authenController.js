import { authenFunc } from "../function/authen.js";

const login = async (req, res) => {
    res.send(await authenFunc.login(req.body));
}

const refeshToken = async (req, res) => {
	res.send(await authenFunc.refeshToken(req));
}

export const authenController = {
    login,
	refeshToken
}