import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async(req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if(!token){
      return res.status(401).json({message: 'No Token is present'});
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if(!decode){
      return res.status(401).json({message: 'Invalid token'});
    }

    const user = await User.findOne({_id: decode.userId}).select("-password");
    if(!user) {
      return res.status(401).json({message: 'Invalid Token, unAuthorized Access'});
    }

    req.user = user;

    next();
  } catch (error) {
    console.log('Error in authMiddleware '+ error);
    return res.status(500).json({message: 'Internal Server error at auth Middleware'});
  }

}