import { Router } from "express";
import * as jopControllers from "./Job.controllers.js";
import { validation } from "../../middleware/valedation.middleware.js";
import {
  addJobSchema,
  allJobsForCOmpaney,
  applyJobSchema,
  filterdJobsSchema,
  jobIdSchema,
  updateJobSchema,
} from "./jop.schema.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { uploadFileCloud } from "../../utils/multerCloud.js";

const router = Router();

// ! Add Job
router.post(
  "/addJob",
  authMiddleware,
  validation(addJobSchema),
  jopControllers.addJob
);

// ! Update Job
router.patch(
  "/updateJob/:id",
  authMiddleware,
  validation(updateJobSchema),
  jopControllers.updateJob
);

// ! Delete Job
router.delete(
  "/deleteJob/:id",
  authMiddleware,
  validation(jobIdSchema),
  jopControllers.deleteJob
);

// ! Get all Jobs with their company’s information.
router.get(
  "/allJobsWithCompInfo",
  authMiddleware,
  jopControllers.allJobsWithCompInfo
);

// ! Get all Jobs for a specific company.
router.get(
  "/allJobsForCompaney",
  authMiddleware,
  validation(allJobsForCOmpaney),
  jopControllers.allJobsForCompaney
);

// ! Get all Jobs that match the following filters
router.get(
  "/filterdJobs",
  authMiddleware,
  validation(filterdJobsSchema),
  jopControllers.filterdJobs
);

// ! Apply to Job
router.post(
  "/applyJob/:jobId",
  authMiddleware,
  uploadFileCloud().single("reseme"),
  jopControllers.applyJob
);

export default router;
