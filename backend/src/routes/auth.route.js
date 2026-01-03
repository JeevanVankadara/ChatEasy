import express from "express";
import { signup, login, logout, updateProfile, checkAuth, updatePassword, googleLogin} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/login", login);

route.post('/signup', signup);

route.post('/logout', logout)

route.put('/updateProfile', protectRoute, updateProfile);

route.put('/updatePassword', protectRoute, updatePassword);

route.get('/check', protectRoute, checkAuth);

route.post('/googleLogin', googleLogin);

export default route;