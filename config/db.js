const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
    try {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        const mongod = await MongoMemoryServer.create();

        const uri = mongod.getUri();

        console.log("Mongo memory server uri: ", uri);

        await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

const disconnectDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
};

module.exports = { connectDB, disconnectDB };
