"use strict";

const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");

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
            // get all the profiles
            const profiles = await Profile.find();
            if (profiles.length === 0) {
                return res.status(404).json({ msg: "No Profiles found" });
            }
            res.json(profiles);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    });

    // @route   GET profiles/:id
    // @desc    Get profile by id
    // @access  Public for testing
    router.get("/:id", async (req, res) => {
        try {
            const profile = await Profile.findById(req.params.id);

            if (!profile) {
                return res.status(404).json({ msg: "Profile not found" });
            }

            res.render("profile_template", {
                profile,
            });
        } catch (err) {
            console.error(err.message);
            if (err.kind === "ObjectId") {
                return res.status(404).json({ msg: "Profile not found" });
            }
            res.status(500).send("Server Error");
        }
    });

    // @route   POST profiles
    // @desc    Register a new profile
    // @access  Public for testing
    router.post("/", async (req, res) => {
        const {
            name,
            description,
            mbti,
            enneagram,
            variant,
            tritype,
            socionics,
            sloan,
            psyche,
            image,
        } = req.body;

        try {
            // See if profile exists based on name
            // Assuming profiles have unique names
            let profile = await Profile.findOne({ name });

            if (profile) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "Profile already exists" }] });
            }

            // Creating new Profile
            profile = new Profile({
                name,
                description,
                mbti,
                enneagram,
                variant,
                tritype,
                socionics,
                sloan,
                psyche,
                image,
            });
            await profile.save();
            res.json({ msg: "Profile added" });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    });

    return router;
};
