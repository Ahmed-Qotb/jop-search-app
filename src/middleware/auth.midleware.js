import { User } from "../../db/models/User.model.js";
import { Token } from "../../db/models/token.model.js";
import { asyncHandeler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandeler(async (req, res, next) => {
  // ? check login
  let { token } = req.headers;
  // console.log(token);
  // ? check token existance
  if (!token) {
    return next(new Error("token missing !"));
  }

  // ? check prefix
  if (!token.startsWith(process.env.BEARER_KEY)) {
    return next(new Error("invalid token !!"));
  }

  token = token.split(process.env.BEARER_KEY)[1];

  // ? check token in db
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB) {
    return next(new Error("token expired !!"));
  }

  // ? generate payload
  const payload = jwt.verify(token, process.env.TOKEN_SECRET);

  // ? check user
  const isUser = await User.findById(payload.id);
  if (!isUser) {
    return next(new Error("User not found"));
  }

  // ? pass user to the next controller
  req.user = isUser;

  // ? call next controller
  return next();
});
