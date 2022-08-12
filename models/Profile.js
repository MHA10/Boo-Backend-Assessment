const mongoose = require("mongoose");

// Profile entity schema for MongoDB
const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    mbti: {
        type: String,
        required: false,
    },
    enneagram: {
        type: String,
        required: false,
    },
    variant: {
        type: String,
        required: false,
    },
    tritype: {
        type: String,
        required: false,
    },
    socionics: {
        type: String,
        required: false,
    },
    sloan: {
        type: String,
        required: false,
    },
    psyche: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
});

module.exports = User = mongoose.model("profile", ProfileSchema);
