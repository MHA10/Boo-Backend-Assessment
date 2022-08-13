const mongoose = require("mongoose");

// User entity schema for MongoDB
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

module.exports = User = mongoose.model("user", UserSchema);
