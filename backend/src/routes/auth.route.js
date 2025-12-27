import express from "express";
import { signup, login, logout, updateProfile, checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/login", login);

route.post('/signup', signup);

route.post('/logout', logout)

route.put('/updateProfile', protectRoute, updateProfile);

route.get('/check', protectRoute, checkAuth);

export default route;