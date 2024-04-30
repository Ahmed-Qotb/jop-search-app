import joi from "joi";
import { Types } from "mongoose";

// ! Add company schema
const addComponeySchema = joi
  .object({
    companyName: joi.string().min(2).required(),
    description: joi.string().min(5).required(),
    industry: joi.string().min(2).required(),
    address: joi.string().min(5).required(),
    numberOfEmployees: joi.number().required(),
    companyEmail: joi.string().email().required(),
  })
  .required();

// ! Update company data
const updateCompanySchema = joi
  .object({
    id: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    companyName: joi.string().min(2),
    description: joi.string().min(5),
    industry: joi.string().min(2),
    address: joi.string().min(5),
    numberOfEmployees: joi.number(),
    companyEmail: joi.string().email(),
  })
  .required();

// ! Delete company data
const CompanyIdSchema = joi
  .object({
    id: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
  })
  .required();

// ! Search for a company with a name.
const serachByNameSchema = joi
  .object({
    name: joi.string().required(),
  })
  .required();
export {
  addComponeySchema,
  updateCompanySchema,
  CompanyIdSchema,
  serachByNameSchema,
};
