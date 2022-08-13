"use strict";

const express = require("express");
const router = express.Router();

const userService = require("../services/user.services");

module.exports = function () {
    // @route   GET users
    // @desc    Get all the users
    // @access  Public for testing
    router.get("/all", async (req, res) => {
        try {
            // get all the users
            const users = await userService.getUsers();
            res.json(users);
        } catch (err) {
            console.error(err.message);
            res.status(404).json({ msg: err.message });
        }
    });

    // @route   POST users
    // @desc    Register a new user
    // @access  Public for testing
    router.post("/", async (req, res) => {
        const { name } = req.body;
        try {
            const user = await userService.createUser(name);
            res.json(user);
        } catch (err) {
            console.error(err.message);
            res.status(404).json({ msg: err.message });
        }
    });

    return router;
};
