import { v4 as uuid } from "uuid";
import { OUTPUT_MESSAGE } from "../constants/index.js";
import { HttpStatusCode } from "axios";


export const addStartTime = (req, res, next) => {
    req.startTime = new Date();
    req.requestId = uuid();
    next();

}

const calcEndTime = (req) => {
    const endTime = new Date();
    const start = new Date(req.startTime);
    const totalTimeInMS = endTime.getTime() - start.getTime();
    return { endTime, totalTimeInMS };
}

export const generateExecutionLog = (req, httpStatus = HttpStatusCode.Ok, errors = "", resBody = OUTPUT_MESSAGE) => {
    const { endTime, totalTimeInMS } = calcEndTime(req);
    if (resBody === "") resBody = OUTPUT_MESSAGE;
    const level = httpStatus >= HttpStatusCode.BadRequest ? "Error" : "Info";
    const { method, requestId, path, startTime, params, body, hostname: host, baseUrl, ip: ipAddress, headers, user } = req;
    const log = {
        level,
        requestId,
        method,
        path,
        startTime,
        endTime,
        totalTimeInMS,
        input: {
            params,
            body
        },
        output: resBody,
        metadata: {
            host,
            baseUrl,
            ipAddress,
            headers: {
                origin: headers.origin,
                userAgent: headers["user-agent"]

            }
        },
        user: user?.email || "",
        errors
    }

    console.log(log);
}