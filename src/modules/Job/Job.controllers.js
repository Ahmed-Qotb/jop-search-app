import { Application } from "../../../db/models/Application.model.js";
import { Companey } from "../../../db/models/Company.model.js";
import { Jop } from "../../../db/models/Job.model.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";
import cloudinary from "../../utils/cloud.js";

// ! Add Job
const addJob = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  //   ? creating job
  await Jop.create({
    ...req.body,
    addedBy: user._id,
  });

  //   ? sending response
  return res.json({ success: true, message: "jop added succefully" });
});

// ! Update Job
const updateJob = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  // ? if we need only the one who added the job to update it we will
  // ? compare the added by id and user.id

  const job = await Jop.findById(req.params.id);

  if (!job) {
    return next(new Error("job not found"));
  }
  //   console.log(job.addedBy.toString());
  //   console.log(user._id.toString());
  if (job.addedBy.toString() != user._id.toString()) {
    return next(new Error("unauthrized access"));
  }

  // ? updating jop
  await Jop.findOneAndUpdate(
    { _id: req.params.id, addedBy: user._id },
    {
      ...req.body,
    }
  );

  //   ? sending response
  return res.json({ success: true, message: "job ubdated successfully" });
});

// ! Delete Job
const deleteJob = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  // ? if we need only the one who added the job to update it we will
  // ? compare the added by id and user.id

  const job = await Jop.findById(req.params.id);

  if (!job) {
    return next(new Error("job not found"));
  }

  if (job.addedBy.toString() != user._id.toString()) {
    return next(new Error("unauthrized access"));
  }

  //   ? deleting job
  await Jop.findByIdAndDelete({ _id: req.params.id });

  //   ? sending response
  return res.json({ success: true, message: "job deleted successfully" });
});

// ! Get all Jobs with their company’s information.
const allJobsWithCompInfo = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR" && user.role != "User") {
    return next(new Error("unauthrized access"));
  }

  //   ? getting all jobs
  const jobs = await Jop.find().populate("relatedCompaney");

  //   ? if no jobs found
  if (jobs.length === 0) {
    return next(new Error("no jobs yet"));
  }

  //   ?sending response
  return res.json({ success: true, results: { jobs } });
});

// ! Get all Jobs for a specific company.
const allJobsForCompaney = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR" && user.role != "User") {
    return next(new Error("unauthrized access"));
  }

  // ? Find the company based on the company name
  const company = await Companey.findOne({
    companyName: req.query.companyName,
  });

  // ? if the company notfound
  if (!company) {
    next(new Error("Company not found"));
  }
  // ?Find all jobs for the specific company and populate related company information
  const jobs = await Jop.find({ relatedCompaney: company._id }).populate(
    "relatedCompaney"
  );

  //   ? if no jobs found
  if (jobs.length === 0) {
    return next(new Error("no jobs yet"));
  }

  // ?Sending response
  res.json({ success: true, results: { jobs } });
});

// ! Get all Jobs that match the following filters
const filterdJobs = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR" && user.role != "User") {
    return next(new Error("unauthrized access"));
  }

  //   ? searching for jobs
  const jobs = await Jop.find({ ...req.body });

  //   ? if joobs not found
  if (jobs.length == 0) {
    return next(new Error("not found"));
  }

  //   ? sending response
  return res.json({ success: true, results: { jobs } });
});

// ! Apply to Job
const applyJob = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  //   console.log(user.role);
  if (user.role != "User") {
    return next(new Error("unauthrized access???"));
  }

  //   ? upload resume in cloud
  //   console.log(req.file);

  const result = await cloudinary.uploader.upload(req.file.path);
  //   console.log(result);
  //   ? save application data in the database
  await Application.create({
    jobId: req.params.jobId,
    userId: user._id,
    ...req.body,
    userResume: { secure_url: result.secure_url, pdfId: result.public_id },
  });

  return res.json({ success: true, message: "aplication was successfull" });
});

export {
  addJob,
  updateJob,
  deleteJob,
  allJobsWithCompInfo,
  allJobsForCompaney,
  filterdJobs,
  applyJob,
};
