const Comment = require("../models/Comment");
const User = require("../models/User");
const Profile = require("../models/Profile");

const sortRecent = "recent";
const sortBest = "best";

const filterComments = (comments, filter) => {
    // Assuming comments can be filtered in two ways
    // 1. For all the personality systems
    // 2. For any one personality system at a time
    // Specific personality system must be passed in as a query param in request
    if (filter === "MBTI" || filter === "Enneagram" || filter === "Zodiac") {
        // filter comments where specific personality system has a value
        comments = comments.filter((comment) => {
            return comment[`vote${filter}`] !== "";
        });
    }
    return comments;
};

const getComments = async (sort, filter) => {
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
            throw Error("No Comments found");
        }
        return comments;
    } catch (err) {
        throw Error(err.message);
    }
};

const createComment = async (body) => {
    const {
        title,
        description,
        voteMBTI,
        voteEnneagram,
        voteZodiac,
        userId,
        profileId,
    } = body;

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
            throw Error("Invalid User");
        }
        const profile = await Profile.findById(profileId);
        if (!profile) {
            throw Error("Invalid Profile");
        }
        // Reference to the user and profile through Ids
        comment.user = userId;
        comment.profile = profileId;

        await comment.save();
        return comment;
    } catch (err) {
        throw Error(err.message);
    }
};

const getCommentsForAProfile = async (sort, filter, profileId) => {
    try {
        let comments;
        // get all the comments sorted by most likes/recent for a specific profile
        if (sort === sortBest) {
            comments = await Comment.find({
                profile: profileId,
            })
                .select("-user")
                .sort({ likes: -1 });
        } else if (sort === sortRecent) {
            comments = await Comment.find({
                profile: profileId,
            })
                .select("-user")
                .sort({ date: -1 });
        } else {
            comments = await Comment.find({
                profile: profileId,
            }).select("-user");
        }
        // Filter the comments
        comments = filterComments(comments, filter);

        if (comments.length === 0) {
            throw Error("No Comments found");
        }
        return comments;
    } catch (err) {
        throw Error(err.message);
    }
};

const likeOrUnlikeComment = async (userId, like, commentId) => {
    try {
        let comment;
        // If query to like
        if (like === "1" || like === "true") {
            // Checking if the comment is already liked by the user
            comment = await Comment.findOne({
                id: commentId,
                likedBy: userId,
            });

            if (comment) {
                throw Error("Comment already liked by the user");
            }

            comment = await Comment.findById(commentId);

            if (!comment) {
                throw Error("Invalid Comment");
            }
            comment.likes += 1;
            comment.likedBy.push(userId);
        } else if (like === "0" || like === "false") {
            // Checking if the comment is already unliked by the user
            comment = await Comment.findOne({
                id: commentId,
                likedBy: { $ne: userId },
            });

            if (comment) {
                throw Error("Comment already unliked by the user");
            }

            comment = await Comment.findById(commentId);
            if (!comment) {
                throw Error("Invalid Comment");
            }
            comment.likes -= 1;
            const index = comment.likedBy.indexOf(userId);
            if (index > -1) {
                comment.likedBy.splice(index, 1);
            }
        }
        await comment.save();
        return comment;
    } catch (err) {
        throw Error(err.message);
    }
};

module.exports = {
    getComments,
    createComment,
    getCommentsForAProfile,
    likeOrUnlikeComment,
};
