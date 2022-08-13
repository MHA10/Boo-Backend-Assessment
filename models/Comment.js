const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Comment entity schema for MongoDB
const CommentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    voteMBTI: {
        type: String,
        enum: [
            "",
            "INFP",
            "INFJ",
            "ENFP",
            "ENFJ",
            "INTJ",
            "INTP",
            "ENTP",
            "ENTJ",
            "ISFP",
            "ISFJ",
            "ESFP",
            "ESFJ",
            "ISTP",
            "ISTJ",
            "ESTP",
            "ESTJ",
        ],
        required: false,
        default: "",
    },
    voteEnneagram: {
        type: String,
        enum: [
            "",
            "1w2",
            "2w3",
            "3w2",
            "3w4",
            "4w3",
            "4w5",
            "5w4",
            "5w6",
            "6w5",
            "6w7",
            "7w6",
            "7w8",
            "8w7",
            "8w9",
            "9w8",
            "9w1",
        ],
        required: false,
        default: "",
    },
    voteZodiac: {
        type: String,
        enum: [
            "",
            "Aries",
            "Taurus",
            "Gemini",
            "Cancer",
            "Leo",
            "Virgo",
            "Libra",
            "Scorpio",
            "Sagittarius",
            "Capricorn",
            "Aquarius",
            "Pisces",
        ],
        required: false,
        default: "",
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        required: false,
        default: 0,
    },
    // A user can like/unlike a comment only once
    // Keeps users who liked a comment
    likedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "profile",
    },
});

module.exports = Comment = mongoose.model("comment", CommentSchema);
