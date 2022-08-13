const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

const connectDB = async () => {
    try {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();

        const uri = mongod.getUri();

        console.log("Mongo memory server uri: ", uri);

        await mongoose.connect(uri, {
            useNewUrlParser: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error.message);
        // Exit process with failure
        process.exit(1);
    }
};

const clearDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
    console.log("MongoDB cleared");
};

const disconnectDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
    console.log("MongoDB disconnected");
};

module.exports = { connectDB, clearDB, disconnectDB };
