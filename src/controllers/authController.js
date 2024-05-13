import { Router } from "express";
import { login } from "../services/authService.js";
import { requestValidationMw } from "../middlewares/validationMW.js";
import { LOGIN_KEYS_ARRAY } from "../constants/index.js";

const router = Router();


router.post('/login', (req, res, next) => requestValidationMw(req, res, next, LOGIN_KEYS_ARRAY), login);


export default router;

