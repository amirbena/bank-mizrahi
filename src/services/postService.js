import { generateExecutionLog } from "../middlewares/calcTimes.js";
import { createPostEndPoint, getPostsEndPoint } from "../network/index.js"
import { handleAxiosErrors } from "../utils/index.js";

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
        const { errorMessage, errorStatus } = handleAxiosErrors(error);
        generateExecutionLog(req, errorStatus, errorMessage);
        res.status(errorStatus).send(errorMessage);
    }
}

export const createPost = async (req, res) => {
    try {
        const { title, body } = req.body;
        const result = await createPostEndPoint({ title, body });
        generateExecutionLog(req);
        res.json(result);
    } catch (error) {
        const { errorMessage, errorStatus } = handleAxiosErrors(error);
        generateExecutionLog(req, errorStatus, errorMessage);
        res.status(errorStatus).send(errorMessage);
    }
}