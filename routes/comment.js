"use strict";

const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const Profile = require("../models/Profile");
const User = require("../models/User");

module.exports = function () {
    const sortRecent = "recent";
    const sortBest = "best";

    const filterComments = (comments, filter) => {
        // Assuming comments can be filtered in two ways
        // 1. For all the personality systems
        // 2. For any one personality system at a time
        // Specific personality system must be passed in as a query param in request
        if (
            filter === "MBTI" ||
            filter === "Enneagram" ||
            filter === "Zodiac"
        ) {
            // filter comments where specific personality system has a value
            comments = comments.filter((comment) => {
                return comment[`vote${filter}`] !== "";
            });
        }
        return comments;
    };

    // @route   GET comment/all
    // @desc    Get all the comments sorted/filtered
    // @access  Public for testing
    // Specific sort criteria must be passed in as a query param in request
    // Specific personality system must be passed in as a query param in request
    router.get("/all", async (req, res) => {
        const { sort, filter } = req.query;
        try {
            let comments;
            // get all the comments sorted by most likes/recent
            if (sort === sortBest) {
                comments = await Comment.find().sort({
                    likes: -1,
                });
            } else if (sort === sortRecent) {
                comments = await Comment.find().sort({ date: -1 });
            } else {
                comments = await Comment.find();
            }

            // Filter the comments
            comments = filterComments(comments, filter);

            if (comments.length === 0) {
                return res.status(404).json({ msg: "No Comments found" });
            }
            res.json(comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    // @route   GET comment/profile/:profileId
    // @desc    Get all the comments for a specific profile
    // @access  Public for testing
    // Specific sort criteria must be passed in as a query param in request
    // Specific personality system must be passed in as a query param in request
    router.get("/profile/:profileId", async (req, res) => {
        try {
            let comments;
            const { sort, filter } = req.query;
            // get all the comments sorted by most likes/recent for a specific profile
            if (sort === sortBest) {
                comments = await Comment.find({
                    profile: req.params.profileId,
                })
                    .select("-user")
                    .sort({ likes: -1 });
            } else if (sort === sortRecent) {
                comments = await Comment.find({
                    profile: req.params.profileId,
                })
                    .select("-user")
                    .sort({ date: -1 });
            } else {
                comments = await Comment.find({
                    profile: req.params.profileId,
                }).select("-user");
            }

            // Filter the comments
            comments = filterComments(comments, filter);

            if (comments.length === 0) {
                return res.status(404).json({ msg: "No Comments found" });
            }
            res.json(comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    // @route   POST comment
    // @desc    Register a new comment
    // @access  Public for testing
    router.post("/", async (req, res) => {
        const {
            title,
            description,
            voteMBTI,
            voteEnneagram,
            voteZodiac,
            userId,
            profileId,
        } = req.body;

        try {
            // Creating new Comment
            const comment = new Comment({
                title,
                description,
                voteMBTI,
                voteEnneagram,
                voteZodiac,
            });

            // check user and profile
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Invalid User" });
            }
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ msg: "Invalid Profile" });
            }
            // Reference to the user and profile through Ids
            comment.user = userId;
            comment.profile = profileId;

            await comment.save();
            res.json(comment);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

    // @route   POST comment/:id
    // @desc    Like/Unlike a comment
    // @access  Public for testing
    // Specific like/unlike flag must be passed in as a query param in request
    router.post("/:id", async (req, res) => {
        try {
            const { userId } = req.body;
            const { like } = req.query;
            let comment;
            // If query to like
            if (like === "1" || like === "true") {
                // Checking if the comment is already liked by the user
                comment = await Comment.findOne({
                    id: req.params.id,
                    likedBy: userId,
                });

                if (comment) {
                    return res
                        .status(404)
                        .json({ msg: "Comment already liked by the user" });
                }

                comment = await Comment.findById(req.params.id);
                if (!comment) {
                    return res.status(404).json({ msg: "Invalid Comment" });
                }
                comment.likes += 1;
                comment.likedBy.push(userId);
            } else if (like === "0" || like === "false") {
                // Checking if the comment is already unliked by the user
                comment = await Comment.findOne({
                    id: req.params.id,
                    likedBy: { $ne: userId },
                });

                if (comment) {
                    return res
                        .status(404)
                        .json({ msg: "Comment already unliked by the user" });
                }

                comment = await Comment.findById(req.params.id);
                if (!comment) {
                    return res.status(404).json({ msg: "Invalid Comment" });
                }
                comment.likes -= 1;
                const index = comment.likedBy.indexOf(userId);
                if (index > -1) {
                    comment.likedBy.splice(index, 1);
                }
            }

            await comment.save();
            res.json(comment);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

    return router;
};
