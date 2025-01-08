import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Form } from "../models/form.model.js";
import { Response } from "../models/response.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const createForm = asyncHandler(async (req, res) => {
    try {
        const { title, description, fields, style, isPublished } = req.body;
    
        if (!title || !fields || fields.length === 0) {
            throw new ApiError(400, 'Title and fields are required');
        }
    
        const newForm = new Form({
            title,
            description,
            fields,
            style,
            isPublished: isPublished || false,
        });
    
        await newForm.save();
    
        res.status(201).json(
            new ApiResponse(201, {formId: newForm._id}, 'Form created successfully')
        );
    } catch (error) {
        console.log(error);
        
    }
});

const updateForm = asyncHandler(async (req, res) => {
    try {
        const { formId } = req.params;
        const { title, description, fields, style, isPublished } = req.body;
    
        const form = await Form.findById(formId);
        if (!form) {
            throw new ApiError(404, 'Form not found');
        }
    
        form.title = title || form.title;
        form.description = description || form.description;
        form.fields = fields || form.fields;
        form.style = style || form.style;
        form.isPublished = typeof isPublished === 'boolean' ? isPublished : form.isPublished;
    
        const updatedForm = await form.save();
    
        res.status(200).json(
            new ApiResponse(200, {form: updatedForm}, 'Form updated successfully')
        );
    } catch (error) {
        console.log(error);
        
    }
});

const deleteForm = asyncHandler(async (req, res) => {
    const { formId } = req.params;

    // Find the form by ID
    const form = await Form.findById(formId);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    // Delete the form
    await form.deleteOne({ _id: formId });

    res.status(200).json(
        new ApiResponse(200, 'Form deleted successfully')
    );
});

const viewForm = asyncHandler(async (req, res) => {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    res.status(200).json(
        new ApiResponse(200, form, 'Form retrieved successfully')
    );
});

const duplicateForm = asyncHandler(async (req, res) => {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    const duplicatedForm = new Form({
        title: `${form.title} (Copy)`,
        description: form.description,
        fields: form.fields,
        style: form.style,
        isPublished: false,
    });

    await duplicatedForm.save();

    res.status(201).json(
        new ApiResponse(201, {formId: duplicatedForm._id}, 'Form duplicated successfully')
    );
});

const getPublishedForm = asyncHandler(async (req, res) => {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    if (!form.isPublished) {
        throw new ApiError(403, 'This form is not published yet');
    }

    res.status(200).json({
        message: 'Form retrieved successfully',
        form: {
            title: form.title,
            description: form.description,
            fields: form.fields,
            style: form.style
        }
    });
});

const listAllForms = asyncHandler(async (req, res) => {
    const { adminId } = req.admin; 
    
    const forms = await Form.find({ createdBy: adminId });

    if (!forms || forms.length === 0) {
        throw new ApiError(404, 'No forms found');
    }

    res.status(200).json(
        new ApiResponse(200, forms, 'Forms retrieved successfully')
    );
});

const viewAllResponses = asyncHandler(async (req, res) => {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    const responses = await Response.find({ formId });

    if (!responses || responses.length === 0) {
        res.status(404);
        throw new Error('No responses found for this form');
    }

    res.status(200).json(
        new ApiResponse(200, {formTitle: form.title,}, 'Responses retrieved successfully')
        );
});

export {
    createForm,
    updateForm,
    deleteForm,
    viewForm,
    duplicateForm,
    getPublishedForm,
    listAllForms,
    viewAllResponses
}