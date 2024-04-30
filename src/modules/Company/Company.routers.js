import { Router } from "express";
import * as componeyControllers from "./Company.controllers.js";
import { authMiddleware } from "../../middleware/auth.midleware.js";
import { validation } from "../../middleware/valedation.middleware.js";
import {
  CompanyIdSchema,
  addComponeySchema,
  serachByNameSchema,
  updateCompanySchema,
} from "./componey.schema.js";

const router = Router();

// ! Add company
router.post(
  "/addCompaney",
  authMiddleware,
  validation(addComponeySchema),
  componeyControllers.addComponey
);

// ! Update company data
router.patch(
  "/updateCompany/:id",
  authMiddleware,
  validation(updateCompanySchema),
  componeyControllers.updateCompany
);

// ! Delete company data
router.delete(
  "/deleteCompany/:id",
  authMiddleware,
  validation(CompanyIdSchema),
  componeyControllers.deleteCompany
);

// ! Get company data
router.get(
  "/getCompaneyData/:id",
  authMiddleware,
  validation(CompanyIdSchema),
  componeyControllers.getCompaneyData
);

// ! Get company data
router.get(
  "/serachByNameSchema/:name",
  authMiddleware,
  validation(serachByNameSchema),
  componeyControllers.serachByName
);

// ! Get all applications for specific Jobs
router.get(
  "/allAppsForSpecificJop/:id",
  authMiddleware,
  validation(CompanyIdSchema),
  componeyControllers.allAppsForSpecificJop
);

export default router;
