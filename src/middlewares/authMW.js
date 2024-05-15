import { HttpStatusCode } from "axios";
import { generateExecutionLog } from "./calcTimes.js";
import jwt from 'jsonwebtoken';
import { AUTHORIZATION_MISSING_MESSAGE, BEARER_STARTER, INVALID_TOKEN_MESSAGE, JWT_EXPIRED_ERROR_MESSAGE, JWT_SECRET, TOKEN_EXPIRED_MESSAGE } from "../constants/index.js";


const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(payload);
            }
        })
    })
}

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let error = "";
    if (!authHeader || !authHeader.startsWith(BEARER_STARTER)) {
        error = AUTHORIZATION_MISSING_MESSAGE;
        generateExecutionLog(req, HttpStatusCode.Unauthorized, error);
        return res.status(HttpStatusCode.Unauthorized).send(error);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = await verifyToken(token);
        req.user = payload;
        next();
    } catch (ex) {
        let status = HttpStatusCode.Unauthorized;
        if (ex.message === JWT_EXPIRED_ERROR_MESSAGE) {
            status = HttpStatusCode.Forbidden;
            error = TOKEN_EXPIRED_MESSAGE;
        }
        else {
            error = INVALID_TOKEN_MESSAGE;
        }
        generateExecutionLog(req, status, error);
        return res.status(status).send(error);
    }
}

