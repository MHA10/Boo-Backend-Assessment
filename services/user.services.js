var User = require("../models/User");

const getUsers = async () => {
    try {
        // get all the users
        const users = await User.find();
        if (users.length === 0) {
            throw Error("No Users found")
        }
        return users;
    } catch (err) {
        throw Error (err.message);
    }
};

const createUser = async (name) => {
    try {
        // See if user exists based on name
        // Assuming users have unique names
        let user = await User.findOne({ name });

        if (user) {
            throw Error ("User already exists");
        }

        // Creating new User
        user = new User({
            name,
        });
        await user.save();
        return user;
    } catch (err) {
        throw Error (err.message);
    }
}

module.exports = { getUsers, createUser };
