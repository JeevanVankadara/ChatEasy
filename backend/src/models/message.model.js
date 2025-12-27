import { text } from "express";
import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true    
  },
  text:{
    type: String
  },
  Image:{
    type: String
  }
}, {timestamp: true});

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;