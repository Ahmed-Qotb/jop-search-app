import joi from "joi";
import { Types } from "mongoose";

// ! sign up Schema
const signupSchema = joi
  .object({
    // ? for request . body
    firstName: joi.string().min(2).required(),
    lastName: joi.string().min(2).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: joi.ref("password"),
    recoveryEmail: joi.string().email().required(),
    DOB: joi.date().required(),
    mobileNumber: joi.string().required(),
    role: joi.string().valid("User", "Company_HR").required(),
  })
  .required();

// ! sign In Schema
const signInSchema = joi
  .object({
    // ? for request . body
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  })
  .required();

// ! update account schema
const updateAccountSchema = joi
  .object({
    firstName: joi.string().min(2),
    lastName: joi.string().min(2),
    email: joi.string().email(),
    recoveryEmail: joi.string().email(),
    DOB: joi.date(),
    mobileNumber: joi.string(),
  })
  .required();

// ! Get profile data for another user schema
const profileDataSchema = joi
  .object({
    id: joi.custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) {
        return true;
      } else {
        return helper.message("invalid id type");
      }
    }),
  })
  .required();

// ! Update password schema
const updatePassSchema = joi
  .object({
    currentPassword: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    newPassword: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })
  .required();

// ! forget password schema

// ! generate otp schema
const otpSchema = joi
  .object({
    mobileNumber: joi.string().required(),
  })
  .required();

// ! changing forget password
const forgetPasswordSchema = joi
  .object({
    mobileNumber: joi.string().required(),
    otp: joi.number().required(),
    newPassword: joi
      .string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
  })
  .required();

// ! Get all accounts associated to a specific recovery Email schema
const getAllAccByRecEmailSchema = joi
  .object({
    recoveryEmail: joi.string().email().required(),
  })
  .required();

export {
  signupSchema,
  signInSchema,
  updateAccountSchema,
  profileDataSchema,
  updatePassSchema,
  forgetPasswordSchema,
  otpSchema,
  getAllAccByRecEmailSchema,
};
