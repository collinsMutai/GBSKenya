const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "General inquiry",
                "Volunteer",
                "Partnership",
                "Media"
            ],
            required: true
        },

        message: {
            type: String,
            required: true,
            maxlength: 3000
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Contact", ContactSchema);