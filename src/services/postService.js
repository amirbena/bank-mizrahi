import { AxiosError, HttpStatusCode } from "axios";
import { generateExecutionLog } from "../middlewares/calcTimes.js";
import { createPostEndPoint, getPostsEndPoint } from "../network/index.js"

export const getPosts = async (req, res) => {
    try {
        const returnedPosts = [];
        const { userCode } = req.user;
        const posts = await getPostsEndPoint()
        posts.forEach((post) => {
            if (userCode === post.userId) {
                returnedPosts.push(post)
            }
        });
        generateExecutionLog(req);
        res.json(returnedPosts);
    } catch (error) {
        generateExecutionLog(req, HttpStatusCode.InternalServerError, error.message, error.message);
        res.status(HttpStatusCode.InternalServerError).send(error.message);
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const result = await createPostEndPoint({ title, body });
        generateExecutionLog(req);
        res.json(result);
    } catch (error) {
        if (error instanceof AxiosError) {
            const { status, message } = error;
            generateExecutionLog(req, status, message, message);
            return res.status(status).send(message);
        }
        generateExecutionLog(req, HttpStatusCode.InternalServerError, error.message, error.message);
        res.status(HttpStatusCode.InternalServerError).send(error.message);
    }
}