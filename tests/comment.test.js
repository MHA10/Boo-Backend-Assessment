const mongoose = require("mongoose");

const db = require("../db/db");
const commentService = require("../services/comment.services");
const userService = require("../services/user.services");
const profileService = require("../services/profile.services");
const Comment = require("../models/Comment");

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
 * Comment test suite.
 */
describe("comment ", () => {
    /**
     * Tests that valid comments are retrieved correctly.
     */
    it("Get all comments", async () => {
        // Creating User and Profile for the Comment
        const user = await userService.createUser("Test User - 1");
        commentObject1.userId = user.id;
        commentObject2.userId = user.id;
        const profile = await profileService.createProfile(profileObject1);
        commentObject1.profileId = profile.id;
        commentObject2.profileId = profile.id;

        await commentService.createComment(commentObject1);
        await commentService.createComment(commentObject2);
        const commentsTocheck = await commentService.getComments();

        // Verifying first object
        expect(commentsTocheck[0].title).toEqual("First comment");
        expect(commentsTocheck[0].description).toEqual(
            "This is the first test comment",
        );
        expect(commentsTocheck[0].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[0].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[0].voteZodiac).toEqual("Gemini");
        expect(commentsTocheck[0].user._id).toEqual(user._id);
        expect(commentsTocheck[0].profile._id).toEqual(profile._id);
        expect(commentsTocheck[0].likes).toEqual(0);

        // Verifying second object
        expect(commentsTocheck[1].title).toEqual("Second comment");
        expect(commentsTocheck[1].description).toEqual(
            "This is the second test comment",
        );
        expect(commentsTocheck[1].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[1].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[1].voteZodiac).toEqual("Gemini");
        expect(commentsTocheck[1].user._id).toEqual(user._id);
        expect(commentsTocheck[1].profile._id).toEqual(profile._id);
        expect(commentsTocheck[1].likes).toEqual(0);
    });

    /**
     * Tests that valid comments are retrieved and sorted correctly.
     */
    it("Get all comments sorted", async () => {
        // Creating User and Profile for the Comment
        const user = await userService.createUser("Test User - 1");
        commentObject1.userId = user.id;
        commentObject2.userId = user.id;
        const profile = await profileService.createProfile(profileObject1);
        commentObject1.profileId = profile.id;
        commentObject2.profileId = profile.id;

        const firstComment = await commentService.createComment(commentObject1);
        await commentService.createComment(commentObject2);

        // Liking the comment created first
        await commentService.likeOrUnlikeComment(
            firstComment.user._id.valueOf(),
            (like = "1"),
            firstComment.id,
        );

        // Testing sorted on recent criteria
        let commentsTocheck = await commentService.getComments("recent");

        // Verifying first object
        expect(commentsTocheck[1].title).toEqual("First comment");
        expect(commentsTocheck[1].description).toEqual(
            "This is the first test comment",
        );
        expect(commentsTocheck[1].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[1].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[1].voteZodiac).toEqual("Gemini");
        expect(commentsTocheck[1].user._id).toEqual(user._id);
        expect(commentsTocheck[1].profile._id).toEqual(profile._id);
        expect(commentsTocheck[1].likes).toEqual(1);

        // Verifying second object
        expect(commentsTocheck[0].title).toEqual("Second comment");
        expect(commentsTocheck[0].description).toEqual(
            "This is the second test comment",
        );
        expect(commentsTocheck[0].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[0].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[0].voteZodiac).toEqual("Gemini");
        expect(commentsTocheck[0].user._id).toEqual(user._id);
        expect(commentsTocheck[0].profile._id).toEqual(profile._id);
        expect(commentsTocheck[0].likes).toEqual(0);

        // Testing sorted on best criteria
        commentsTocheck = await commentService.getComments("best");

        // Verifying first object
        expect(commentsTocheck[0].title).toEqual("First comment");
        expect(commentsTocheck[0].description).toEqual(
            "This is the first test comment",
        );
        expect(commentsTocheck[0].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[0].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[0].voteZodiac).toEqual("Gemini");
        expect(commentsTocheck[0].user._id).toEqual(user._id);
        expect(commentsTocheck[0].profile._id).toEqual(profile._id);
        expect(commentsTocheck[0].likes).toEqual(1);

        // Verifying second object
        expect(commentsTocheck[1].title).toEqual("Second comment");
        expect(commentsTocheck[1].description).toEqual(
            "This is the second test comment",
        );
        expect(commentsTocheck[1].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[1].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[1].voteZodiac).toEqual("Gemini");
        expect(commentsTocheck[1].user._id).toEqual(user._id);
        expect(commentsTocheck[1].profile._id).toEqual(profile._id);
        expect(commentsTocheck[1].likes).toEqual(0);
    });

    /**
     * Tests that valid comments are retrieved and filters correctly.
     */
    it("Get all comments filtered", async () => {
        // Creating User and Profile for the Comment
        const user = await userService.createUser("Test User - 1");
        commentObject3.userId = user.id;
        commentObject4.userId = user.id;
        const profile = await profileService.createProfile(profileObject1);
        commentObject3.profileId = profile.id;
        commentObject4.profileId = profile.id;

        await commentService.createComment(commentObject3);
        await commentService.createComment(commentObject4);

        // Testing sorted on recent criteria
        let commentsTocheck = await commentService.getComments("", "MBTI");
        // Verifying the object with MBTI filter
        expect(commentsTocheck.length).toEqual(1);
        expect(commentsTocheck[0].title).toEqual("Only MBTI vote comment");
        expect(commentsTocheck[0].description).toEqual(
            "This is a test comment",
        );
        expect(commentsTocheck[0].voteMBTI).toEqual("ENTJ");
        expect(commentsTocheck[0].voteEnneagram).toEqual("");
        expect(commentsTocheck[0].voteZodiac).toEqual("");
        expect(commentsTocheck[0].user._id).toEqual(user._id);
        expect(commentsTocheck[0].profile._id).toEqual(profile._id);
        expect(commentsTocheck[0].likes).toEqual(0);

        commentsTocheck = await commentService.getComments("", "Enneagram");
        // Verifying the object with Enneagram filter
        expect(commentsTocheck.length).toEqual(1);
        expect(commentsTocheck[0].title).toEqual("Only Enneagram vote comment");
        expect(commentsTocheck[0].description).toEqual(
            "This is a test comment",
        );
        expect(commentsTocheck[0].voteMBTI).toEqual("");
        expect(commentsTocheck[0].voteEnneagram).toEqual("2w3");
        expect(commentsTocheck[0].voteZodiac).toEqual("");
        expect(commentsTocheck[0].user._id).toEqual(user._id);
        expect(commentsTocheck[0].profile._id).toEqual(profile._id);
        expect(commentsTocheck[0].likes).toEqual(0);
    });

    /**
     * Tests that if no comments added, exception thrown correctly
     */
    it("Get exception when no comments added", async () => {
        try {
            await commentService.getComments();
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("No Comments found");
        }
    });

    /**
     * Tests that a valid comment can be created through the comment route correctly.
     */
    it("Create comment", async () => {
        // Creating User and Profile for the Comment
        const user = await userService.createUser("Test User - 1");
        commentObject1.userId = user.id;
        const profile = await profileService.createProfile(profileObject1);
        commentObject1.profileId = profile.id;
        const comment = await commentService.createComment(commentObject1);
        const commentTocheck = await Comment.findById(comment.id);

        // Verifying the object created
        expect(commentTocheck.title).toEqual("First comment");
        expect(commentTocheck.description).toEqual(
            "This is the first test comment",
        );
        expect(commentTocheck.voteMBTI).toEqual("ENTJ");
        expect(commentTocheck.voteEnneagram).toEqual("2w3");
        expect(commentTocheck.voteZodiac).toEqual("Gemini");
        expect(commentTocheck.user._id).toEqual(user._id);
        expect(commentTocheck.profile._id).toEqual(profile._id);
        expect(commentTocheck.likes).toEqual(0);
    });

    /**
     * Tests that if invalid user ID used for creating a comment, exception thrown correctly
     */
    it("Create comment, invalid user", async () => {
        try {
            commentObject1.userId = "11f1ae1b11111111cb11c111";
            await commentService.createComment(commentObject1);
        } catch (error) {
            expect(error.message).toEqual("Invalid User");
        }
    });

    /**
     * Tests that if invalid profile ID used for creating a comment, exception thrown correctly
     */
    it("Create comment, invalid profile", async () => {
        try {
            // Create a valid user
            const user = await userService.createUser("Test User - 1");
            commentObject1.userId = user.id;
            commentObject1.profileId = "11f1ae1b11111111cb11c111";
            await commentService.createComment(commentObject1);
        } catch (error) {
            expect(error.message).toEqual("Invalid Profile");
        }
    });

    /**
     * Tests that comments can be liked and unliked by a user
     */
    it("Like / Unlike a comment", async () => {
        // Creating User and Profile for the Comment
        const user = await userService.createUser("Test User - 1");
        commentObject1.userId = user.id;
        const profile = await profileService.createProfile(profileObject1);
        commentObject1.profileId = profile.id;

        const firstComment = await commentService.createComment(commentObject1);

        // Like the comment created first
        await commentService.likeOrUnlikeComment(
            firstComment.user._id.valueOf(),
            (like = "1"),
            firstComment.id,
        );
        // Testing liked comment and user id added correctly
        let comment = await Comment.findById(firstComment.id);
        expect(comment.likes).toEqual(1);
        expect(comment.likedBy[0]).toEqual(user._id);

        // Unlike the comment created first
        await commentService.likeOrUnlikeComment(
            firstComment.user._id.valueOf(),
            (like = "0"),
            firstComment.id,
        );
        // Testing unliked comment and user id removed correctly
        comment = await Comment.findById(firstComment.id);
        expect(comment.likes).toEqual(0);
        expect(comment.likedBy[0]).not.toEqual(user._id);
    });

    /**
     * Tests that comments can be liked by a user only once, exception thrown correctly
     */
    it("Like a comment by a user only once", async () => {
        try {
            // Creating User and Profile for the Comment
            const user = await userService.createUser("Test User - 1");
            commentObject1.userId = user.id;
            const profile = await profileService.createProfile(profileObject1);
            commentObject1.profileId = profile.id;

            const firstComment = await commentService.createComment(
                commentObject1,
            );

            // Like the comment created first
            await commentService.likeOrUnlikeComment(
                firstComment.user._id.valueOf(),
                (like = "1"),
                firstComment.id,
            );
            // Like the comment created first again
            await commentService.likeOrUnlikeComment(
                firstComment.user._id.valueOf(),
                (like = "1"),
                firstComment.id,
            );
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("Comment already liked by the user");
        }
    });

    /**
     * Tests that comments can be unliked by a user only once, exception thrown correctly
     */
    it("Unlike a comment by a user only once", async () => {
        try {
            // Creating User and Profile for the Comment
            const user = await userService.createUser("Test User - 1");
            commentObject1.userId = user.id;
            const profile = await profileService.createProfile(profileObject1);
            commentObject1.profileId = profile.id;

            const firstComment = await commentService.createComment(
                commentObject1,
            );

            // Unlike the comment created first
            await commentService.likeOrUnlikeComment(
                firstComment.user._id.valueOf(),
                (like = "0"),
                firstComment.id,
            );
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual(
                "Comment already unliked by the user",
            );
        }
    });

    /**
     * Tests that an invalid commentId is passed
     */
    it("Invalid comment to like", async () => {
        try {
            // Creating User and Profile for the Comment
            const user = await userService.createUser("Test User - 1");
            commentObject1.userId = user.id;
            const profile = await profileService.createProfile(profileObject1);
            commentObject1.profileId = profile.id;

            const firstComment = await commentService.createComment(
                commentObject1,
            );

            // Unlike the comment created first
            await commentService.likeOrUnlikeComment(
                firstComment.user._id.valueOf(),
                (like = "1"),
                "11f1ae1b11111111cb11c111",
            );
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("Invalid Comment");
        }
    });

    /**
     * Tests that an invalid commentId is passed
     */
    it("Invalid comment to unlike", async () => {
        try {
            // Creating User and Profile for the Comment
            const user = await userService.createUser("Test User - 1");
            commentObject1.userId = user.id;
            const profile = await profileService.createProfile(profileObject1);
            commentObject1.profileId = profile.id;

            const firstComment = await commentService.createComment(
                commentObject1,
            );

            // Like the comment created first
            await commentService.likeOrUnlikeComment(
                firstComment.user._id.valueOf(),
                (like = "1"),
                firstComment.id,
            );
            // Unlike the comment created first
            await commentService.likeOrUnlikeComment(
                firstComment.user._id.valueOf(),
                (like = "0"),
                "11f1ae1b11111111cb11c111",
            );
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("Invalid Comment");
        }
    });

    /**
     * Tests that valid comments for a specific profile are retrieved correctly.
     */
    it("Get all comments for a profile", async () => {
        // Creating User and Profile for the Comment
        const user = await userService.createUser("Test User - 1");
        commentObject1.userId = user.id;
        commentObject2.userId = user.id;
        commentObject3.userId = user.id;
        const profile = await profileService.createProfile(profileObject1);
        commentObject1.profileId = profile.id;
        commentObject2.profileId = profile.id;

        const secondProfile = await profileService.createProfile(
            profileObject2,
        );
        commentObject3.profileId = secondProfile.id;

        await commentService.createComment(commentObject1);
        await commentService.createComment(commentObject2);
        await commentService.createComment(commentObject3);
        const commentsTocheck = await commentService.getCommentsForAProfile(
            "",
            "",
            profile.id,
        );

        // Verifying objects for only first profile
        expect(commentsTocheck.length).toEqual(2);
        expect(commentsTocheck.length).not.toEqual(3);
        expect(commentsTocheck[0].profile._id).toEqual(profile._id);
        expect(commentsTocheck[1].profile._id).toEqual(profile._id);
    });

    /**
     * Tests that no comments found for a profile, exception thrown correctly
     */
    it("No comments found for a profile", async () => {
        try {
            // Creating User and Profile for the Comment
            const user = await userService.createUser("Test User - 1");
            commentObject1.userId = user.id;
            const profile = await profileService.createProfile(profileObject1);
            commentObject1.profileId = profile.id;

            const secondProfile = await profileService.createProfile(
                profileObject2,
            );

            await commentService.createComment(commentObject1);
            await commentService.getCommentsForAProfile(
                "",
                "",
                secondProfile.id,
            );
        } catch (error) {
            // Verify correct exception thrown
            expect(error.message).toEqual("No Comments found");
        }
    });
});

/**
 * Complete comment example.
 */
const commentObject1 = {
    title: "First comment",
    description: "This is the first test comment",
    voteMBTI: "ENTJ",
    voteEnneagram: "2w3",
    voteZodiac: "Gemini",
};
const commentObject2 = {
    title: "Second comment",
    description: "This is the second test comment",
    voteMBTI: "ENTJ",
    voteEnneagram: "2w3",
    voteZodiac: "Gemini",
};
const commentObject3 = {
    title: "Only MBTI vote comment",
    description: "This is a test comment",
    voteMBTI: "ENTJ",
};
const commentObject4 = {
    title: "Only Enneagram vote comment",
    description: "This is a test comment",
    voteEnneagram: "2w3",
};

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
    name: "A Martinez second profile",
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
