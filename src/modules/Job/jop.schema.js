import joi from "joi";
import { Types } from "mongoose";

// ! add Job schema
const addJobSchema = joi
  .object({
    jobTitle: joi.string().min(2).required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: joi.string().min(3).required(),
    technicalSkills: joi.string().min(3).required(),
    softSkills: joi.string().min(3).required(),
    relatedCompaney: joi
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

// ! update Job schema
const updateJobSchema = joi
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
    jobTitle: joi.string().min(2),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string().min(3),
    technicalSkills: joi.string().min(3),
    softSkills: joi.string().min(3),
    relatedCompaney: joi.custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) {
        return true;
      } else {
        return helper.message("invalid id type");
      }
    }),
  })
  .required();

//   ! delete job schema
const jobIdSchema = joi
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

//   ! Get all Jobs for a specific company schema
const allJobsForCOmpaney = joi
  .object({
    companeyName: joi.string().min(2).required(),
  })
  .required();

// ! Get all Jobs that match the following filters schema
const filterdJobsSchema = joi
  .object({
    jobTitle: joi.string().min(2),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    technicalSkills: joi.string().min(3),
  })
  .required();

// ! Apply to Job
const applyJobSchema = joi
  .object({
    jobId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    userId: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) {
          return true;
        } else {
          return helper.message("invalid id type");
        }
      })
      .required(),
    userTechSkills: joi.string().min(2).required(),
    userSoftSkills: joi.string().min(2).required(),
    userResume: joi.string().required(),
  })
  .required();

export {
  addJobSchema,
  updateJobSchema,
  jobIdSchema,
  allJobsForCOmpaney,
  filterdJobsSchema,
  applyJobSchema,
};
