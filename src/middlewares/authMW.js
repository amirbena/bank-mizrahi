import { HttpStatusCode } from "axios";
import { generateExecutionLog } from "./calcTimes.js";
import jwt from 'jsonwebtoken';
import { AUTHORIZATION_MISSING_MESSAGE, INVALID_TOKEN_MESSAGE, JWT_SECRET, TOKEN_EXPIRED_MESSAGE } from "../constants/index.js";


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
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        error = AUTHORIZATION_MISSING_MESSAGE;
        generateExecutionLog(req, HttpStatusCode.Unauthorized, error, error);
        return res.status(HttpStatusCode.Unauthorized).send(error);
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = await verifyToken(token);
        const { requestId } = req;
        const { requestId: requestIdPayload } = payload;
        /* if (requestId !== requestIdPayload) {
            error = "Request Ids are different between token and request";
            generateExecutionLog(req, HttpStatusCode.Unauthorized, error, error);
            return res.status(HttpStatusCode.Unauthorized).send(error);
        } */
        req.user = payload;
        next();
    } catch (ex) {
        let status = HttpStatusCode.Unauthorized;
        if (ex.message === "jwt expired") {
            status = HttpStatusCode.Forbidden;
            error = TOKEN_EXPIRED_MESSAGE;
        }
        else {
            error = INVALID_TOKEN_MESSAGE;
        }
        generateExecutionLog(req, status, error, error);
        return res.status(status).send(error);
    }
}

