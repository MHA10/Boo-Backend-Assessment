"use strict";

const express = require("express");
const router = express.Router();

const profileService = require("../services/profile.services");

const profiles = [
    {
        id: 1,
        name: "A Martinez",
        description: "Adolph Larrue Martinez III.",
        mbti: "ISFJ",
        enneagram: "9w3",
        variant: "sp/so",
        tritype: 725,
        socionics: "SEE",
        sloan: "RCOEN",
        psyche: "FEVL",
        image: "https://soulverse.boo.world/images/1.png",
    },
];

module.exports = function () {
    router.get("/", function (req, res, next) {
        res.render("profile_template", {
            profile: profiles[0],
        });
    });

    // @route   GET profiles
    // @desc    Get all the profiles
    // @access  Public for testing
    router.get("/all", async (req, res) => {
        try {
            const profiles = await profileService.getProfiles();
            res.json(profiles);
        } catch (err) {
            console.error(err.message);
            res.status(404).json({ msg: err.message });
        }
    });

    // @route   GET profiles/:id
    // @desc    Get profile by id
    // @access  Public for testing
    router.get("/:id", async (req, res) => {
        try {
            const profile = await profileService.getProfileById(req.params.id);
            res.render("profile_template", {
                profile,
            });
        } catch (err) {
            console.error(err.message);
            if (err.kind === "ObjectId") {
                return res.status(404).json({ msg: err.message });
            }
            return res.status(404).json({ msg: err.message });
        }
    });

    // @route   POST profiles
    // @desc    Register a new profile
    // @access  Public for testing
    router.post("/", async (req, res) => {
        try {
            const profile = await profileService.createProfile(req.body);
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(404).json({ msg: err.message });
        }
    });

    return router;
};
