import { Router } from "express";
import { authMiddleware } from "../middlewares/authMW.js";
import { createPost, getPosts } from "../services/postService.js";
import { requestValidationMw } from "../middlewares/validationMW.js";
import { CREATE_POST_KEYS_ARRAY } from "../constants/index.js";

const router = Router();

router.get('/', authMiddleware, getPosts);
router.post('/', authMiddleware, (req, res, next) => requestValidationMw(req, res, next, CREATE_POST_KEYS_ARRAY), createPost);

export default router;