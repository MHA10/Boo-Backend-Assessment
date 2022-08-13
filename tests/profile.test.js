const mongoose = require("mongoose");

const db = require("../db/db");
const profileService = require("../services/profile.services");
const Profile = require("../models/Profile");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await db.connectDB());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await db.clearDB());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await db.disconnectDB());

/**
 * Profile test suite.
 */
describe("profile ", () => {
    /**
     * Tests that a valid profiles are retrieved correctly.
     */
    it("Get all profiles", async () => {
        await profileService.createProfile(profileObject1);
        await profileService.createProfile(profileObject2);
        const profilesTocheck = await profileService.getProfiles();
        // Verifying first object
        expect(profilesTocheck[0].name).toEqual("A Martinez");
        expect(profilesTocheck[0].description).toEqual(
            "Adolph Larrue Martinez III.",
        );
        expect(profilesTocheck[0].mbti).toEqual("ISFJ");
        expect(profilesTocheck[0].enneagram).toEqual("9w3");
        expect(profilesTocheck[0].variant).toEqual("sp/so");
        expect(profilesTocheck[0].tritype).toEqual(725);
        expect(profilesTocheck[0].socionics).toEqual("SEE");
        expect(profilesTocheck[0].sloan).toEqual("RCOEN");
        expect(profilesTocheck[0].psyche).toEqual("FEVL");
        expect(profilesTocheck[0].image).toEqual(
            "https://soulverse.boo.world/images/1.png",
        );

        // Verifying second object
        expect(profilesTocheck[1].name).toEqual("A Martinez 1");
        expect(profilesTocheck[1].description).toEqual(
            "Adolph Larrue Martinez III.",
        );
        expect(profilesTocheck[1].mbti).toEqual("ISFJ");
        expect(profilesTocheck[1].enneagram).toEqual("9w3");
        expect(profilesTocheck[1].variant).toEqual("sp/so");
        expect(profilesTocheck[1].tritype).toEqual(725);
        expect(profilesTocheck[1].socionics).toEqual("SEE");
        expect(profilesTocheck[1].sloan).toEqual("RCOEN");
        expect(profilesTocheck[1].psyche).toEqual("FEVL");
        expect(profilesTocheck[1].image).toEqual(
            "https://soulverse.boo.world/images/1.png",
        );
    });

    /**
     * Tests that if no profiles added, exception thrown correctly
     */
    it("Get exception when no profiles added", async () => {
        try {
            await profileService.getProfiles();
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("No Profiles found");
        }
    });

    /**
     * Tests that a valid profile can be created through the profile route correctly.
     */
    it("Create profile", async () => {
        const profile = await profileService.createProfile(profileObject1);
        const profileTocheck = await Profile.findById(profile.id);

        // Verifying the object created
        expect(profileTocheck.name).toEqual("A Martinez");
        expect(profileTocheck.description).toEqual(
            "Adolph Larrue Martinez III.",
        );
        expect(profileTocheck.mbti).toEqual("ISFJ");
        expect(profileTocheck.enneagram).toEqual("9w3");
        expect(profileTocheck.variant).toEqual("sp/so");
        expect(profileTocheck.tritype).toEqual(725);
        expect(profileTocheck.socionics).toEqual("SEE");
        expect(profileTocheck.sloan).toEqual("RCOEN");
        expect(profileTocheck.psyche).toEqual("FEVL");
        expect(profileTocheck.image).toEqual(
            "https://soulverse.boo.world/images/1.png",
        );
    });

    /**
     * Tests that a profile already exists
     */
    it("Get exception when a profile with same name already exists", async () => {
        try {
            await profileService.createProfile(profileObject1);
            await profileService.createProfile(profileObject1);
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("Profile already exists");
        }
    });

    /**
     * Tests that a specific proifle is fetched correctly
     */
    it("Get a specific profile", async () => {
        const profile = await profileService.createProfile(profileObject1);
        const profileTocheck = await profileService.getProfileById(profile.id);
        // Verifying the object created
        expect(profileTocheck.name).toEqual("A Martinez");
        expect(profileTocheck.description).toEqual(
            "Adolph Larrue Martinez III.",
        );
        expect(profileTocheck.mbti).toEqual("ISFJ");
        expect(profileTocheck.enneagram).toEqual("9w3");
        expect(profileTocheck.variant).toEqual("sp/so");
        expect(profileTocheck.tritype).toEqual(725);
        expect(profileTocheck.socionics).toEqual("SEE");
        expect(profileTocheck.sloan).toEqual("RCOEN");
        expect(profileTocheck.psyche).toEqual("FEVL");
        expect(profileTocheck.image).toEqual(
            "https://soulverse.boo.world/images/1.png",
        );
    });

    /**
     * Tests that if no profile with the given id, exception thrown correctly
     */
    it("Get a specific profile", async () => {
        try {
            await profileService.createProfile(profileObject1);
            await profileService.getProfileById("123");
        } catch (error) {
            expect(error.message).toEqual("Profile not found");
        }
    });
});

/**
 * Complete profile example.
 */
const profileObject1 = {
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
};
const profileObject2 = {
    name: "A Martinez 1",
    description: "Adolph Larrue Martinez III.",
    mbti: "ISFJ",
    enneagram: "9w3",
    variant: "sp/so",
    tritype: 725,
    socionics: "SEE",
    sloan: "RCOEN",
    psyche: "FEVL",
    image: "https://soulverse.boo.world/images/1.png",
};
