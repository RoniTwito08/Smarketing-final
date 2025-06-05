import { get } from "axios";
import userModel, { User } from "../models/user_models";
import { Request, Response } from "express";

// Create user
// const createUser = async (req: Request, res: Response) => {
//   try {
//     const user = new userModel(req.body);
//     await user.save();
//     res.status(200).send(user);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

//Read (get) user by id
const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id; // returns mail instead of id
  try {
    const user = await userModel.findById(userId).select("-password");
    if (user != null) res.send(user);
    else res.status(400).send("user not found");
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete user by id
const deleteUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const user = await userModel.findOneAndDelete({ _id: id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

//get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    res.send(users);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getEmailById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findById(userId).select("email");
    if (user != null) res.send(user);
    else res.status(400).send("user not found");
  } catch (error) {
    res.status(400).send(error);
  }
};

const getGoogleCustomerIdByUserId = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user || !user.googleCustomerId) {
      return res.status(404).json({ message: "Google Customer ID not found" });
    }

    return res.json({ googleCustomerId: user.googleCustomerId });
  } catch (error) {
    console.error("Error fetching customer ID:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    console.log("before fetching user by email:", email);
    const user = await userModel.findOne({ email });

    console.log("getUserByEmail - user:", user);

    if (!user) {
      return res.status(404).json({ exists: false });
    }

    return res.status(200).json({ exists: true });
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return res.status(500).json({ message: "Server error", exists: false });
  }
};

export default {
  getUserById,
  deleteUserById,
  getAllUsers,
  getEmailById,
  getGoogleCustomerIdByUserId,
  getUserByEmail,
};
