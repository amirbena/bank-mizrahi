import axios from "axios";
import { POSTS_ENDPOINT, USERS_ENDPOINT } from "../constants/index.js";

//1 Exercise
export const getUsersFromEndPoint = async () => {
    try {
        const result = await axios.get(USERS_ENDPOINT);
        return result.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}


export const getPostsEndPoint = async () => {
    const result = await axios.get(POSTS_ENDPOINT);
    return result.data;
}


export const createPostEndPoint = async ({ title, body }) => {
    const result = await axios.post(POSTS_ENDPOINT, { title, body });
    return result.data;
}