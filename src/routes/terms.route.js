import { Router } from "express";
import { protectRoute, role } from "../middlewares/auth.middleware.js";
import termsValidation from "../middlewares/validations/terms.validation.js";
import termController from "../controllers/terms.controller.js";
import { checkId } from "../utils/checkId.util.js";

const router = Router();

router.route('/')
    .post(protectRoute, role('admin'), termsValidation, termController.addTerm)
    .get(termController.terms);

router.route('/:id')
    .get(checkId, termController.term)
    .put(protectRoute, role('admin'), checkId, termsValidation, termController.updateTerm)
    .delete(protectRoute, role('admin'), checkId, termController.deleteTerm);

export default router