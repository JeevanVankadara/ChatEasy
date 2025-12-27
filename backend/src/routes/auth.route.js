import express from "express";
import { signup, signin, login } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/login", login);

route.post('/signup', signup);

route.post('/signin', signin)

export default route;