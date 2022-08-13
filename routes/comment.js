"use strict";

const express = require("express");
const router = express.Router();

const Comment = require("../models/Comment");
const commentService = require("../services/comment.services");

module.exports = function () {
    // @route   GET comment/all
    // @desc    Get all the comments sorted/filtered
    // @access  Public for testing
    // Specific sort criteria must be passed in as a query param in request
    // Specific personality system must be passed in as a query param in request
    router.get("/all", async (req, res) => {
        const { sort, filter } = req.query;
        try {
            let comments = await commentService.getComments(sort, filter);
            res.json(comments);
        } catch (err) {
            console.error(err.message);
            return res.status(404).json({ msg: err.message });
        }
    });

    // @route   GET comment/profile/:profileId
    // @desc    Get all the comments for a specific profile
    // @access  Public for testing
    // Specific sort criteria must be passed in as a query param in request
    // Specific personality system must be passed in as a query param in request
    router.get("/profile/:profileId", async (req, res) => {
        try {
            const { sort, filter } = req.query;
            const comments = await commentService.getCommentsForAProfile(sort, filter, req.params.profileId);
            res.json(comments);
        } catch (err) {
            console.error(err.message);
            return res.status(404).json({ msg: err.message });
        }
    });

    // @route   POST comment
    // @desc    Register a new comment
    // @access  Public for testing
    router.post("/", async (req, res) => {
        try {
            const comment = await commentService.createComment(req.body);
            res.json(comment);
        } catch (err) {
            console.error(err.message);
            return res.status(404).json({ msg: err.message });
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
            const comment = await commentService.likeOrUnlikeComment(userId, like, req.params.id);
            res.json(comment);
        } catch (err) {
            console.error(err.message);
            return res.status(404).json({ msg: err.message });
        }
    });

    return router;
};
