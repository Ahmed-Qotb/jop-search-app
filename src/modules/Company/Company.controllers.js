import { Application } from "../../../db/models/Application.model.js";
import { Companey } from "../../../db/models/Company.model.js";
import { Jop } from "../../../db/models/Job.model.js";
import { asyncHandeler } from "../../utils/asyncHandeler.js";

// ! Add company
const addComponey = asyncHandeler(async (req, res, next) => {
  // ? we checked for user existance in auth middleware
  // ? we will just check for his role

  const user = req.user;
  console.log(user);
  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  // ? creating componey with hr id from auth midlware
  await Companey.create({
    ...req.body,

    companyHR: user._id,
  });

  // ? sending response
  return res.json({ success: true, message: "componey created successfully" });
});

// ! Update company data
const updateCompany = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  const companey = await Companey.find({
    _id: req.params.id,
    companyHR: user._id,
  });

  // ? if there are no matching companey and hr ids
  if (!companey) {
    return next(
      new Error("there are no companey with this hr id or companey not found")
    );
  }

  //   ? updating companey
  await Companey.findByIdAndUpdate(
    { _id: req.params.id },
    {
      ...req.body,
    }
  );

  //  ? sending response
  return res.json({
    success: true,
    message: "companey data updated successfully",
  });
});

// ! Delete company data
const deleteCompany = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  const companey = await Companey.findOne({
    _id: req.params.id,
    companyHR: user._id,
  });

  // ? if there are no matching companey and hr ids
  if (!companey) {
    return next(
      new Error("there are no companey with this hr id or companey not found")
    );
  }

  //  ? deleting companey
  await Companey.findOneAndDelete({
    _id: req.params.id,
    companyHR: user._id,
  });

  //  ? sending response
  return res.json({
    success: true,
    message: "companey deleted successfully",
  });
});

// !Get company data
const getCompaneyData = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  const companey = await Companey.findOne({
    _id: req.params.id,
    companyHR: user._id,
  });

  // ? if there are no matching companey and hr ids
  if (!companey) {
    return next(
      new Error("there are no companey with this hr id or companey not found")
    );
  }
  // ? getting related jops to that companey
  let jops = await Jop.find({ relatedCompaney: companey._id });

  // ? if there are no jops
  if (jops.length == 0) {
    jops = "no jops related to this companey";
  }

  // ? sending rsponse
  return res.json({
    success: true,
    results: { companey, jops },
  });
});

// ! Search for a company with a name.
const serachByName = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR" && user.role != "user") {
    return next(new Error("unauthrized access"));
  }

  // ? searching companies
  let companies;
  companies = await Companey.find({
    companyName: { $regex: new RegExp(req.params.name, "i") },
  });

  // ? sending response
  return res.json({
    success: true,
    results: { companies: companies.length > 0 ? companies : "not found" },
  });
});

// ! Get all applications for specific Jobs
const allAppsForSpecificJop = asyncHandeler(async (req, res, next) => {
  // ? cheack for user role
  const user = req.user;

  // ? if user is not hr
  if (user.role != "Company_HR") {
    return next(new Error("unauthrized access"));
  }

  const companey = await Companey.findOne({
    _id: req.params.id,
    companyHR: user._id,
  });

  // ? if there are no matching companey and hr ids
  if (!companey) {
    return next(
      new Error("there are no companey with this hr id or companey not found")
    );
  }

  // ? getting related jops to that companey
  const jops = await Jop.find({ relatedCompaney: companey._id });

  // ? if there are no jops
  if (jops.length === 0) {
    return next(new Error("no jops so there are no applications"));
  }

  // ? extracing jop ids
  const jopIds = jops.map((jop) => {
    return jop._id;
  });

  // ? finding all aplications with the jop ids
  const applications = await Application.find({
    jopId: { $in: jopIds },
  }).populate("userId", "firstName lastName email");

  // ? if there are no applications
  if (!applications) {
    return next(new Error("no applications to this jop were found"));
  }

  // ? sending response
  return res.json({ success: true, results: { applications } });
});

export {
  addComponey,
  updateCompany,
  deleteCompany,
  getCompaneyData,
  serachByName,
  allAppsForSpecificJop,
};
