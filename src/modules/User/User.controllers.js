import { User } from "../../../db/models/User.model.js";
import { Token } from "../../../db/models/token.model.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// 1. firstName
// 2. lastName
// 3. username ( firstName + lastName)
// 4. email ⇒ ( unique )
// 5. password
// 6. recoveryEmail ⇒ (not unique)
// 7. DOB (date of birth, must be date format 2023-12-4)
// 8. mobileNumber ⇒ (unique)
// 9. role ⇒ (User, Company_HR )

// ! Sign Up
const userSignup = asyncHandeler(async (req, res, next) => {
  // ? comparing passwords
  if (req.body.password != req.body.repeat_password) {
    return next(new Error("passwords must match"));
  }

  // ? hashing user password
  const hashedPassword = bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.HASH_ROUNDS)
  );

  // ? user name = fst name + lst name
  const username = req.body.firstName + " " + req.body.lastName;
  console.log(username);

  // ? create user
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
    username,
  });

  // ? sending respone
  return res.json({ success: true, message: "user signed up successfully" });
});

// ! Sign In
const usrSignIn = asyncHandeler(async (req, res, next) => {
  // ? searchin for user in database
  const user = await User.findOne({ email: req.body.email });
  // ? if email wasnt found
  if (!user) {
    return next(new Error("user not found"));
  }

  // ? checking for password match
  const match = bcrypt.compareSync(req.body.password, user.password);

  // ? if password doesn`t match
  if (!match) {
    return next(new Error("incorrect password"));
  }

  // ? generating token if login wass succefull
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.TOKEN_SECRET
  );

  // ? Storing the token in the database
  await Token.create({
    userId: user._id,
    token,
    isValid: true,
  });

  // ? making status online
  await User.findOneAndUpdate(
    { email: req.body.email },
    {
      status: "online",
    }
  );

  // ? sending respone
  return res.json({ success: true, results: { token } });
});

// ! update account
const updateAccount = asyncHandeler(async (req, res, next) => {
  // ? email and number from body to check for conflict
  const { email, mobileNumber } = req.body;

  // ? getting the loged in user data from auth middlware
  const user = req.user;

  // ? checking for mobile number and email conflict
  const emailExistance = await User.findOne({ email });
  const mobileNumberExistance = await User.findOne({ mobileNumber });

  if (emailExistance) {
    return next(new Error("email already in use"));
  }

  if (mobileNumberExistance) {
    return next(new Error("mobile Number already in use"));
  }

  // ? we already checked for user in auth
  // ? updating user info
  await User.findOneAndUpdate({ _id: user._id }, { ...req.body });

  // ? sending respone
  return res.json({ success: true, message: "user updated successfully" });
});

// ! Delete account
const Deleteaccount = asyncHandeler(async (req, res, next) => {
  // ? we checked for user existance from auth
  // ? and we will take id from token so only the owner can delete the account

  // ? delete user from token id
  const user = req.user;
  await User.deleteOne({ _id: user._id });

  // ? we will also delete the token
  await Token.deleteOne({ userId: user._id });

  // ? sending response
  return res.json({ success: true, message: "user deleted successfully" });
});

// ! Get user account data
const userAccData = asyncHandeler(async (req, res, next) => {
  // ? we checked for user existance from auth
  // ? and we will take id from token so only the owner can delete the account

  // ? getting user data from auth middleware
  const user = req.user;

  const userData = {
    fstname: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    DOB: user.DOB,
    Role: user.role,
  };

  // ? sending response
  return res.json({ success: true, results: { userData } });
});

// ! Get profile data for another user
// ? m4 fahem awe ezay hyb2a user m3ah id user tane we y4of el data
// ? fa ana ha3mel show user data by id we 5las m4 fahem awe elsara7a
const profileData = asyncHandeler(async (req, res, next) => {
  // ? searching for user by id from params
  const userProfile = await User.findById(req.params.id);
  // console.log(userProfile);

  // ? if user wasnt found from params
  if (!userProfile) {
    return next(new Error("user not found"));
  }

  const userProfileData = {
    username: userProfile.username,
    email: userProfile.email,
    DOB: userProfile.DOB,
    Role: userProfile.role,
  };

  // ? sending response
  return res.json({ success: true, results: { userProfileData } });
});

// ! Update password
const updatePass = asyncHandeler(async (req, res, next) => {
  const user = req.user;

  // ? comparing current password with password in the database
  const isMatching = bcrypt.compareSync(
    req.body.currentPassword,
    user.password
  );
  if (!isMatching) {
    return next(new Error("password incorrect"));
  }

  // ? Updating password and hashing it
  const newPassword = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.HASH_ROUNDS)
  );
  await User.findOneAndUpdate({ _id: user._id }, { password: newPassword });

  // ? sending response
  return res.json({ success: true, message: "password changed succefully" });
});

// ! Forget password

// ? generat otp
const generateOtp = asyncHandeler(async (req, res, next) => {
  // ? generating otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // ? we can`t send any emails so we will get the user from
  // ? the database by mobile number

  // ? if number wasn`t found
  const user = await User.findOne({ mobileNumber: req.body.mobileNumber });
  if (!user) {
    return next(new Error("user not found !"));
  }

  // ? sending otp to database
  await User.findOneAndUpdate(
    { mobileNumber: req.body.mobileNumber },
    {
      otp,
      otpExpiry: Date.now() + 60 * 1000, // otp time 1 min
    }
  );

  // ? sending response
  return res.json({ success: true, results: { otp } });
});

// ? changing forget password
const forgetPassword = asyncHandeler(async (req, res, next) => {
  // ? search by mobile number
  // ? if number wasn`t found
  const user = await User.findOne({ mobileNumber: req.body.mobileNumber });
  if (!user) {
    next(new Error("user not found !"));
  }

  // ? comparing otp
  if (req.body.otp != user.otp || user.otpExpiry < Date.now()) {
    return next(new Error("otp expired or wrong !"));
  }

  // ? hashing new password
  const newPassword = bcrypt.hashSync(
    req.body.newPassword,
    parseInt(process.env.HASH_ROUNDS)
  );

  // ? changing password
  await User.findOneAndUpdate(
    { mobileNumber: req.body.mobileNumber },
    { password: newPassword }
  );

  // ? sending response
  return res.json({ success: true, message: "password changed succefully" });
});

// ! Get all accounts associated to a specific recovery Email
const getAllAccByRecEmail = asyncHandeler(async (req, res, next) => {
  // ? searching for accounts
  const accounts = await User.find({
    recoveryEmail: req.body.recoveryEmail,
  });

  // ? if not found
  if (!accounts) {
    return next(new Error("no accounts were found"));
  }

  // ? Extract information
  const userAccountsData = accounts.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    DOB: user.DOB,
    role: user.role,
  }));

  // ? sending response
  return res.json({ success: true, results: { userAccountsData } });
});

export {
  userSignup,
  usrSignIn,
  updateAccount,
  Deleteaccount,
  userAccData,
  profileData,
  updatePass,
  forgetPassword,
  generateOtp,
  getAllAccByRecEmail,
};
