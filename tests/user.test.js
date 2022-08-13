const mongoose = require("mongoose");

const db = require("../db/db");
const userService = require("../services/user.services");
const User = require("../models/User");

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
 * User test suite.
 */
describe("user ", () => {
    /**
     * Tests that a valid users are retrieved correctly.
     */
    it("Get all users", async () => {
        await userService.createUser(userObject1.name);
        await userService.createUser(userObject2.name);
        const usersTocheck = await userService.getUsers();

        // Verifying first object
        expect(usersTocheck[0].name).toEqual("User-1");
        // Verifying second object
        expect(usersTocheck[1].name).toEqual("User-2");
    });

    /**
     * Tests that if no users added, exception thrown correctly
     */
    it("Get exception when no users added", async () => {
        try {
            await userService.getUsers();
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("No Users found");
        }
    });

    /**
     * Tests that a valid user can be created through the user route correctly.
     */
    it("Create user", async () => {
        const user = await userService.createUser(userObject1.name);
        const userTocheck = await User.findById(user.id);

        // Verifying the object created
        expect(userTocheck.name).toEqual("User-1");
    });

    /**
     * Tests that a user already exists
     */
    it("Get exception when a user with same name already exists", async () => {
        try {
            await userService.createUser(userObject1.name);
            await userService.createUser(userObject1.name);
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("User already exists");
        }
    });
});

/**
 * Complete user example.
 */
const userObject1 = {
    name: "User-1",
};
const userObject2 = {
    name: "User-2",
};
