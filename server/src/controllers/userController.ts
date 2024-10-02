import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";

// Create a new user
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.findUserById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Fetch all users (with pagination)
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1; // Default to page 1
  const limit = parseInt(req.query.limit as string) || 10; // Default to limit 10

  try {
    const { users, total } = await userService.fetchAllUsers(page, limit);
    res.status(200).json({ users, total, page, limit });
  } catch (error) {
    next(error);
  }
};

// Update a user by ID
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ message: "User successfully deleted." });
  } catch (error) {
    next(error);
  }
};
