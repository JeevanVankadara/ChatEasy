import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET);
  res.cookie("jwt", token, {
    sameSite: "strict"
  });
}