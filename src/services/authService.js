
import { APP_USERS_NAME, JWT_SECRET, USER_NOT_FOUND_FILE_MESSAGE } from '../constants/index.js';
import { getUsersFromEndPoint } from '../network/index.js';
import { readFile, writeFile } from 'fs/promises'
import { validate } from 'email-validator';
import { HttpStatusCode } from 'axios';
import jwt from 'jsonwebtoken';
import { generateExecutionLog } from '../middlewares/calcTimes.js';


//1
export const writeFileUsers = async () => {
    try {
        const users = await getUsersFromEndPoint();
        const validResults = [];
        users.forEach(({ email, id: userCode, name: displayName, company: { name: company }, address }) => {
            if (validate(email)) {
                const { city, street } = address;
                validResults.push({
                    email,
                    userCode,
                    displayName,
                    company,
                    address: [city, street]
                })
            }
        });

        await writeFile(APP_USERS_NAME, JSON.stringify(validResults));
    } catch (error) {
        throw error;
    }
}

const signToken = (payload, secret, options) => new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(token);
        }
    })
});

export const login = async (req, res) => {
    let status = HttpStatusCode.Ok;
    let error = "";
    const { body: { email, password }, requestId } = req;
    try {
        const fileResults = await readFile(APP_USERS_NAME);
        const users = JSON.parse(fileResults.toString());
        const isUser = users.find(user => user.email === email);
        if (!isUser) {
            status = HttpStatusCode.NotFound;
            error = USER_NOT_FOUND_FILE_MESSAGE;
        }
        const token = await signToken({ email, requestId, userCode: isUser.userCode }, JWT_SECRET, { expiresIn: '1h' });
        generateExecutionLog(req, status, error, error);
        if (!error) {
            return res.json({ token });
        }

        res.status(status).send(error);
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.InternalServerError).send("Error");
    }

}



