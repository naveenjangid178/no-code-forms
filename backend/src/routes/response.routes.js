import { Router } from "express";
import { viewForm } from "../controllers/form.controller.js";
import { submitResponse } from "../controllers/response.controller.js";

const router = Router();

router.route("/:formId/view").get(viewForm)
router.route("/:formId").post(submitResponse)

export default router;