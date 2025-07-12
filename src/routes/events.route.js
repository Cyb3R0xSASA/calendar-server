import { Router } from "express";
import eventController from "../controllers/events.controller.js";
import { protectRoute, role } from "../middlewares/auth.middleware.js";
import eventsValidation from "../middlewares/validations/event.validation.js";
import { checkId } from "../utils/checkId.util.js";
import checkDuplicate from "../middlewares/check-duplicate.middleware.js";
import { Event } from "../models/events.model.js";
import { upload } from "../middlewares/upload.middleware.js";
import multer from "multer";
import { validateSingleImage } from "../middlewares/validations/image.validation.js";

const router = Router();


router.route('/')
    .post(
        protectRoute,
        role('admin'),
        upload('events').single('image'),
        validateSingleImage,
        eventsValidation,
        checkDuplicate('title', Event, 'event', true),
        eventController.addEvent,
    )
    .get(eventController.events);

router.route('/:id')
    .get(checkId, eventController.event)
    .put(protectRoute, role('admin'), checkId, eventsValidation, eventController.updateEvent)
    .delete(protectRoute, role('admin'), checkId, eventController.deleteEvent);

export default router;