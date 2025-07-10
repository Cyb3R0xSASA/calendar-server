import { HTTP_STATUS } from "../config/constants.conf.js";
import { Term } from "../models/term.model.js";
import { asyncError, sendError, sendSuccess } from "../utils/errorHandler.util.js";
import { noItem } from "../utils/models.js";

const addTerm = asyncError(
    async (req, res, next) => {
        const { title, startDate, endDate } = req.body;
        const term = await Term.findOne({ title });
        if (term)
            return sendError(
                res,
                'Term already exist',
                'ALREADY_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'Term already exist in the database please rename title and try again.'
            );
        console.log('first')
        const newTerm = await Term.create({ title, startDate, endDate });
        return sendSuccess(
            res,
            'Term created successfully.',
            {
                term: {
                    id: newTerm._id,
                    title: newTerm.title,
                    startDate: newTerm.startDate,
                    endDate: newTerm.endDate,
                }
            },
            HTTP_STATUS.CREATED
        );
    }
);

const terms = asyncError(
    async (req, res, next) => {
        const terms = await Term.find().select('_id title startDate endDate');
        if (noItem(res, 'terms', term, term.length)) return;
        return sendSuccess(
            res,
            'Successfully fetched terms',
            { terms: [...terms] },
            HTTP_STATUS.OK,
        );
    }
);

const term = asyncError(
    async (req, res, next) => {
        const term = await Term.findById(req.params.id);
        if (noItem(res, 'term', term)) return;
        return sendSuccess(
            res,
            'Successfully fetched term',
            {
                term: {
                    title: term.title,
                    startDate: term.startDate,
                    endDate: term.endDate,
                }
            },
            HTTP_STATUS.OK,
        );
    }
);

const updateTerm = asyncError(
    async (req, res, next) => {
        const term = await Term.findById(req.params.id);
        if (noItem(res, 'term', term)) return;
        const newTerm = await Term.findByIdAndUpdate(req.params.id);
        return sendSuccess(
            res,
            'Term updated successfully.',
            {
                category: {
                    title: newTerm.title,
                    startDate: newTerm.startDate,
                    endDate: newTerm.endDate,
                }
            },
            HTTP_STATUS.OK,
        );
    }
);

const deleteTerm = asyncError(
    async (req, res, next) => {
        const term = await Term.findById(req.params.id);
        if (noItem(res, 'term', term)) return;
        await Term.deleteOne({ _id: req.params.id });
        return sendSuccess(
            res,
            'Term deleted successfully.',
            undefined,
            HTTP_STATUS.NO_CONTENT,
        );
    }
);



const termController = {
    addTerm,
    terms,
    term,
    updateTerm,
    deleteTerm,
};

export default termController;
