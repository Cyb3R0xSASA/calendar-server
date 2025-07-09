import { Router } from "express";
import { userValidation } from "../middlewares/validations/user.validation.js";
import { userController } from "../controllers/user.controller.js";
import { protectRoute, role } from "../middlewares/auth.middleware.js";
import { checkId } from "../utils/checkId.util.js";
import { uploadImage } from "../config/cloudinary.conf.js";

const router = Router();

router.route('/profile')
    .get(protectRoute, userController.me)
    .put(protectRoute, userValidation.updateProfile, userController.updateProfile);

router.patch('/profile/password', protectRoute, userValidation.changePassword, userController.changePassword);
router.patch('/profile/picture', protectRoute, uploadImage('profile_pics'), userController.profilePicture);

router.get('/', protectRoute, role('admin'), userController.users);
router.delete('/:id', protectRoute, role('admin'), checkId, userController.deleteUser);
router.patch('/:id/role', protectRoute, role('admin'), checkId, userValidation.changeRole, userController.changeRole);

export default router;