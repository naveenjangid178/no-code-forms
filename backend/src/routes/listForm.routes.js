import { Router } from "express";
import { listAllForms } from "../controllers/form.controller";

const router = Router()

router.route("/").get(listAllForms)

export default router