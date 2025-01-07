import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Form } from "../models/form.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Response } from "../models/response.model.js"

const submitResponse = asyncHandler(async (req, res) => {
    const { responses } = req.body;
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
        throw new ApiError(404, 'Form not found');
    }

    const errors = [];
    form.fields.forEach(field => {
        const response = responses[field.label]; // Access response by label directly
        if (field.required && (!response || response === '')) {
            errors.push(`Field "${field.label}" is required`);
        }
    });

    if (errors.length > 0) {
        res.status(400);
        throw new Error(errors.join(', '));
    }

    const newResponse = new Response({
        formId,
        responses
    });

    await newResponse.save();

    res.status(201).json(
        new ApiResponse(201, {responseId: newResponse._id}, 'Response submitted successfully')
    );
});

export {
    submitResponse
}