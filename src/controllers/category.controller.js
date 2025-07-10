import { HTTP_STATUS } from "../config/constants.conf.js";
import { Category } from "../models/category.model.js";
import { asyncError, sendError, sendSuccess } from "../utils/errorHandler.util.js";
import { noItem } from "../utils/models.js";

const addCategory = asyncError(
    async (req, res, next) => {
        const { title } = req.body;
        const category = await Category.findOne({ title });
        if (category)
            return sendError(
                res,
                'Category already exist',
                'ALREADY_EXIST',
                HTTP_STATUS.BAD_REQUEST,
                'Category already exist in the database please rename title and try again.'
            );

        const newCategory = await Category.create({ title });
        sendSuccess(
            res,
            'Category created successfully.',
            {
                category: {
                    id: newCategory._id,
                    title: newCategory.title,
                }
            },
            HTTP_STATUS.CREATED
        );
    }
);

const categories = asyncError(
    async (req, res, next) => {
        const categories = await Category.find().select('title _id');
        if (noItem(res, 'categories', categories, categories.length)) return;
        return sendSuccess(
            res,
            'Successfully fetched categories',
            { categories: [...categories] },
            HTTP_STATUS.OK,
        );
    }
);

const category = asyncError(
    async (req, res, next) => {
        const category = await Category.findOne({ _id: req.params.id });
        if (noItem(res, 'category', category)) return;
        return sendSuccess(
            res,
            'Successfully fetched category',
            {
                category: {
                    id: category._id,
                    title: category.title,
                }
            },
            HTTP_STATUS.OK,
        );
    }
);

const updateCategory = asyncError(
    async (req, res, next) => {
        const category = await Category.findById(req.params.id);
        if (noItem(res, 'category', category)) return;
        const newCategory = await Category.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true, runValidators: true });
        return sendSuccess(
            res,
            'Category updated successfully.',
            {
                category: {
                    id: newCategory._id,
                    title: newCategory.title,
                }
            },
            HTTP_STATUS.OK,
        )
    }
);

const deleteCategory = asyncError(
    async (req, res, next) => {
        const category = await Category.findById(req.params.id);
        if (noItem(res, 'category', category)) return;
        await Category.deleteOne({ _id: req.params.id });
        return sendSuccess(
            res,
            'Category deleted successfully.',
            undefined,
            HTTP_STATUS.NO_CONTENT,
        )
    }
);

const categoryController = {
    addCategory,
    categories,
    category,
    updateCategory,
    deleteCategory,
};

export default categoryController