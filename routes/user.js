"use strict";

const express = require("express");
const router = express.Router();

const User = require("../models/User");

module.exports = function () {
    // @route   GET users
    // @desc    Get all the users
    // @access  Public for testing
    router.get("/all", async (req, res) => {
        try {
            // get all the users
            const users = await User.find();
            if (users.length === 0) {
                return res.status(404).json({ msg: "No Users found" });
            }
            res.json(users);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    // @route   GET users/:id
    // @desc    Get user by id
    // @access  Public for testing
    router.get("/:id", async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ msg: "User not found" });
            }

            res.json(user);
        } catch (err) {
            console.error(err.message);
            if (err.kind === "ObjectId") {
                return res.status(404).json({ msg: "User not found" });
            }
            res.status(500).send("Server Error");
        }
    });

    // @route   POST users
    // @desc    Register a new user
    // @access  Public for testing
    router.post("/", async (req, res) => {
        const { name } = req.body;

        try {
            // See if user exists based on name
            // Assuming users have unique names
            let user = await User.findOne({ name });

            if (user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "User already exists" }] });
            }

            // Creating new User
            user = new User({
                name,
            });
            await user.save();
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

    return router;
};
