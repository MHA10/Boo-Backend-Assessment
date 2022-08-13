var Profile = require("../models/Profile");

const getProfiles = async () => {
    try {
        // get all the profiles
        const profiles = await Profile.find();
        if (profiles.length === 0) {
            throw Error("No Profiles found");
        }
        return profiles;
    } catch (err) {
        throw Error(err.message);
    }
};

const getProfileById = async (profileId) => {
    try {
        const profile = await Profile.findById(profileId);

        if (!profile) {
            throw Error("Profile not found");
        }
        return profile;
    } catch (err) {
        if (err.kind === "ObjectId") {
            throw Error("Profile not found");
        }
        throw Error("Server Error");
    }
};

const createProfile = async (body) => {
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
    } = body;

    try {
        // See if profile exists based on name
        // Assuming profiles have unique names
        let profile = await Profile.findOne({ name });

        if (profile) {
            throw Error("Profile already exists");
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
        return profile;
    } catch (err) {
        throw Error(err.message);
    }
};

module.exports = { getProfiles, getProfileById, createProfile };
