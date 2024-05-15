
import { APP_USERS_NAME, INTERNAL_LOGIN_ERROR, JWT_SECRET, USER_NOT_FOUND_FILE_MESSAGE } from '../constants/index.js';
import { getUsersFromEndPoint } from '../network/index.js';
import { readFile, writeFile } from 'fs/promises'
import { validate } from 'email-validator';
import { HttpStatusCode } from 'axios';
import jwt from 'jsonwebtoken';
import { generateExecutionLog } from '../middlewares/calcTimes.js';



export const writeUsersFile = async () => {
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
    const { body: { email } } = req;
    try {
        const fileResults = await readFile(APP_USERS_NAME);
        const users = JSON.parse(fileResults.toString());
        const isUser = users.find(user => user.email === email);
        if (!isUser) {
            const status = HttpStatusCode.NotFound;
            const error = USER_NOT_FOUND_FILE_MESSAGE;
            generateExecutionLog(req, status, error);
            return res.status(status).send(error);
        }

        const token = await signToken({ email, userCode: isUser.userCode }, JWT_SECRET, { expiresIn: '1h' });
        generateExecutionLog(req);
        return res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(HttpStatusCode.InternalServerError).send(INTERNAL_LOGIN_ERROR);
    }

}



