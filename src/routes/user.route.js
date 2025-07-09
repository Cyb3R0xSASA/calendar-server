import { Router } from "express";
import { userValidation } from "../middlewares/validations/user.validation.js";
import { userController } from "../controllers/user.controller.js";
import { protectRoute, role } from "../middlewares/auth.middleware.js";
import { checkId } from "../utils/checkId.util.js";
import { upload } from "../config/cloudinary.conf.js";

const router = Router();
router.get('/me', protectRoute, userController.me);
router.patch('/change-password', protectRoute, userValidation.changePassword, userController.changePassword);
router.patch('/profile-picture', protectRoute, upload.single('profilePic'), userController.profilePicture);

router.get('/', protectRoute, role('admin'), userController.users);
router.delete('/:id', protectRoute, role('admin'), checkId, userController.deleteUser);
router.patch('/:id/role', protectRoute, role('admin'), checkId, userValidation.changeRole, userController.changeRole);

export default router;