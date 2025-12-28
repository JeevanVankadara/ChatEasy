import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getUsersForSideBar} from '../controllers/message.controller.js';
import {getMessages, sendMessage} from '../controllers/message.controller.js';

const route = express.Router();

route.get("/users", protectRoute, getUsersForSideBar);
route.get("/:id", protectRoute, getMessages);
route.post("/send/:id", protectRoute, sendMessage);

export default route;