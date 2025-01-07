import { Router } from "express"
import { createForm, deleteForm, duplicateForm, updateForm, viewAllResponses, viewForm } from "../controllers/form.controller.js";

const router = Router();

router.route("/").post(createForm)
router.route("/:formId").put(updateForm)
router.route("/:formId").delete(deleteForm)
router.route("/:formId").get(viewForm)
router.route("/:formId/duplicate").post(duplicateForm)
router.route("/:formId/responses").get(viewAllResponses)

export default router;