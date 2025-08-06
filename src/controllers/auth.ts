import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";

interface NewUser {
  username: string;
  email: string;
  password: string;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body as NewUser;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save the new user
    const newUser = new User({username, email, password: hashedPassword,});

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
