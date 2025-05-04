import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { successResponse, errorResponse } from "../utils/response";

// register
export const registerUser = async (req: Request, res: Response) => {
  try {
  const { name, email, password } = req.body;
  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  let user = await User.create({ name, email, password: hashedPassword });
  
  return res.status(201).json(successResponse("success", user));

  } catch (error){
    return res.status(500).json(errorResponse("Failed to register user", error));
  }
};

// login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      message: "Login success",
      user: { name: user.name, email: user.email },
      accessToken
    });
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to login", error));
  }
};


// refresh
export const refreshToken = async (req: Request, res: Response) => {
  const refresh = req.cookies.refreshToken;
  if (!refresh) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = verifyRefreshToken(refresh) as { userId: string };
    const newAccessToken = generateAccessToken(decoded.userId);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
