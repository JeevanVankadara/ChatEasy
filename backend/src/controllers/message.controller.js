import User from '../models/user.model.js';
import Messages from '../models/message.model.js';
import cloudinary from '../lib/cloudinary.js';

export const getUsersForSideBar = async(req, res) => {
  try {
    const LoggedInUser = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: LoggedInUser}}).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('Error in fetching the user details '+ error);
    res.status(500).json({message: "Internal server error"});
  }
};

export const getMessages = async(req, res) =>{
  try {
    const {id : TwoId} = req.params;
    const oneId = req.user._id;

    const messages = await Messages.find({
      $or:[
        {senderId: oneId, receiverId: TwoId},
        {senderId: TwoId, receiverId: oneId} 
      ]
    });

    res.status(200).json(messages);

  } catch (error) {
    console.log('Error in fetching the data '+ error);
    res.status(500).json({message: 'Internal Server error'});
  }
}

export const sendMessage = async(req, res) => {
  try {
    const {id: receiverId} = req.params;
    const senderId = req.user._id;
    const {text, image} = req.body;

    let imageUrl;

    if(image){
      const uploadedResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadedResponse.secure_url;
    }

    const newMessage = new Messages({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    //todo: socket.io pending here

    res.status(200).json(newMessage);

  } catch (error) {
    console.log('Error in sending the message '+error);
    res.status(500).json({message: 'Internal Server error'});
  }
}