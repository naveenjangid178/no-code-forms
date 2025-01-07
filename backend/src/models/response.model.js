import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  responses: { 
    type: Map, 
    of: String, 
    required: true 
  }
}, {timestamps: true});

export const Response = mongoose.model('Response', responseSchema);