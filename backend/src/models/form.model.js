import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
    type: { 
      type: String, 
      required: true, 
      enum: ['text', 'textarea', 'number', 'dropdown', 'checkbox', 'radio', 'date', 'email'] 
    },
    label: { 
        type: String, 
        required: true 
    },
    required: { 
        type: Boolean, 
        default: false 
    },
    placeholder: { 
        type: String 
    }, 
    options: [String], // Array of options (for dropdown, radio, or checkbox fields)
    defaultValue: { 
        type: String 
    },
    style: {
      width: { 
        type: String, 
        default: '100%' 
    },
      color: { 
        type: String, 
        default: '#000' 
    },
      fontSize: { 
        type: String, 
        default: '14px' 
    }
    }
  });

const formSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
    type: String 
    }, 
    fields: [fieldSchema], // Array of fields in the form
    style: { 
    backgroundColor: { 
        type: String, 
        default: '#ffffff' 
    },
    fontFamily: { 
        type: String, 
        default: 'Arial' 
    },
    buttonColor: { 
        type: String, 
        default: '#007bff' 
    }
    },
    isPublished: { 
    type: Boolean, 
    default: false 
    }, 
},{timestamps: true}
);

export const Form = mongoose.model("Form", formSchema);
