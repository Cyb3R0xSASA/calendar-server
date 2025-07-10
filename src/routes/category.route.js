import { Router } from "express";
import { protectRoute, role } from "../middlewares/auth.middleware.js";
import categoryValidation from "../middlewares/validations/category.validation.js";
import categoryController from "../controllers/category.controller.js";
import { checkId } from "../utils/checkId.util.js";

const router = Router();

router.route('/')
    .post(protectRoute, role('admin'), categoryValidation, categoryController.addCategory)
    .get(categoryController.categories);

router.route('/:id')
    .get(checkId, categoryController.category)
    .put(checkId, protectRoute, role('admin'), categoryController.updateCategory)
    .delete(checkId, protectRoute, role('admin'), categoryController.deleteCategory);

export default router;