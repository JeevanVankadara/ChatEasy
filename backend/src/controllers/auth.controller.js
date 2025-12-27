import { generateToken } from "../lib/generateToken.js";
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import cloudinary from '../lib/cloudinary.js';

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

const login = async(req, res) => {
  try {
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(401).json({message: 'All Credentials are required'});
    }

    const LoginUser = await User.findOne({email});


    if(!LoginUser){
      return res.status(401).json({message: 'Invalid Credentials..'});
    }

    const isPasswordMatch = await bcrypt.compare(password, LoginUser.password);

    if(!isPasswordMatch){
      return res.status(401).json({message: 'Invalid credentials..'});
    }

    generateToken(LoginUser._id, res);

    res.status(201).json({
      _id: LoginUser._id,
      email: LoginUser.email,
      fullName: LoginUser.fullName,
      profilePic: LoginUser.profilePic
    })

  } catch (error) {
    console.log('Problem at Login '+ error);
    res.status(500).json({message: 'Internal Server error...'});
  }
}

const logout = (req, res) => {
  try {
    res.cookie("jwt", "");
    res.status(201).json({message: 'Logout successfully...'});
  } catch (error) {
    console.log('Error at Logout ' + error);
    res.status(500).json({message: 'Internal Server error'});
  }
};

const updateProfile = async(req, res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(401).json({message: 'Profile Pic needed'});
    }
    const uploadedResponse = await cloudinary.uploader.upload(profilePic);

    const UpdatingUser = await User.findByIdAndUpdate(userId, {profilePic: uploadedResponse.secure_url}, {new: true});
    
    res.status(200).json(UpdatingUser);

  } catch (error) {
    console.log('Error at updatingprofile ' + error);
    res.status(500).json({message: 'Internal server error'});
  }
}

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log('Error in checkAuth: ' + error);
    res.status(500).json({message: 'Internal Server error'});
  }
}

export {logout, signup, login, updateProfile, checkAuth};