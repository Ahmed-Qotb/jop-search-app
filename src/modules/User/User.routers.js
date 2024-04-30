import { Router } from "express";
import * as userController from "./User.controllers.js";
import { validation } from "../../middleware/valedation.middleware.js";
import {
  forgetPasswordSchema,
  getAllAccByRecEmailSchema,
  otpSchema,
  profileDataSchema,
  signInSchema,
  signupSchema,
  updateAccountSchema,
  updatePassSchema,
} from "./user.schema.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";

const router = Router();

// ! Sign Up
router.post("/signUp", validation(signupSchema), userController.userSignup);

// ! Sign In
router.post("/signIn", validation(signInSchema), userController.usrSignIn);

// ! update account
router.patch(
  "/updateAccount",
  authMiddleware,
  validation(updateAccountSchema),
  userController.updateAccount
);

// ! Delete account
router.delete("/deleteAcc", authMiddleware, userController.Deleteaccount);

// ! Get user account data
router.get("/accData", authMiddleware, userController.userAccData);

// ! Get profile data for another user
router.get(
  "/profileData/:id",
  validation(profileDataSchema),
  authMiddleware,
  userController.profileData
);

// ! Update password
router.patch(
  "/updatePass",
  authMiddleware,
  validation(updatePassSchema),
  userController.updatePass
);

// ! forget Password

// ? generat otp
router.patch("/generateOtp", validation(otpSchema), userController.generateOtp);

// ? changing forget password
router.patch(
  "/forgetPassword",
  validation(forgetPasswordSchema),
  userController.forgetPassword
);

// ! Get all accounts associated to a specific recovery Email
router.get(
  "/getAllAccByRecEmail",
  validation(getAllAccByRecEmailSchema),
  authMiddleware,
  userController.getAllAccByRecEmail
);

export default router;
