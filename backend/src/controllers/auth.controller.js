import { generateToken } from "../lib/generateToken.js";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

const signup = async (req, res) => {
  try {
    const {email, fullName, password} = req.body;

    if(!fullName || !email || !password){
      return res.status(400).json({message: 'All Credentials are Required'});
    }
    
    if(password.length < 6){
      return res.status(400).json({message: 'Password must have 6 characters'});
    }
    const alreadyExist = await User.findOne({email});

    if(alreadyExist){
      return res.status(400).json({message: 'Email already Existing...'});
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashPassword
    });

    if(newUser){
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic
      })
  }else{
    return res.status(400).json({message: 'Invalid User Details..'});
  }
  } catch (error) {
    console.log(`Something went wrong new signup... :- ${error}`);
    res.status(500).json({message: `Internal Server problem`});
  }
}

const login = (req, res) => {
  res.send('login');
}

const signin = (req, res) => {
  res.send('Sign in');
};

export {signin, signup, login};