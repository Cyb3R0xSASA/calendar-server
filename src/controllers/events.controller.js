import { HTTP_STATUS } from "../config/constants.conf.js";
import { Event } from "../models/events.model.js";
import { asyncError, sendSuccess } from "../utils/errorHandler.util.js";

const addEvent = asyncError(
    async (req, res, next) => {
        const { title, description, date, categories, targetGroups, banner, products } = req.body;
        const event = await Event.create({
            user: req.user.userId,
            title,
            description,
            date,
            categories,
            targetGroups,
            banner: { ...banner, image: req.file.path },
        });

        const populatedEvent = await Event.findById(event._id)
            .select('-__v -_id -user')
            .populate('categories', 'title')
            .lean();

        return sendSuccess(
            res,
            'Event created successfully',
            {
                event: { ...populatedEvent }
            },
            HTTP_STATUS.CREATED
        );
    },
);

const event = asyncError(
    async (req, res, next) => { }
);

const events = asyncError(
    async (req, res, next) => { }
);

const updateEvent = asyncError(
    async (req, res, next) => { }
);

const deleteEvent = asyncError(
    async (req, res, next) => { }
);

const eventController = {
    addEvent,
    event,
    events,
    updateEvent,
    deleteEvent,
};

export default eventController;