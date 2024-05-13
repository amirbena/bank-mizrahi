import { HttpStatusCode } from "axios";
import { generateExecutionLog } from "./calcTimes.js";

const getKeysMissing = (req, keysArray) => keysArray.filter(key => !req.body.hasOwnProperty(key));


export const requestValidationMw = (req, res, next, keysArray) => {
    const keysMissing = getKeysMissing(req, keysArray);
    if (!keysMissing.length) return next();
    const error = `${keysMissing.join(",")} keys is missing to continue`
    generateExecutionLog(req, HttpStatusCode.BadRequest, error, error);
    return res.status(HttpStatusCode.BadRequest).send(error);
}