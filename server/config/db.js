const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/testdb";
    const maxAttempts = 5;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
            await mongoose.connect(mongoUri);
            console.log("Mongo connected");
            return;
        } catch (error) {
            console.error(`Mongo connection attempt ${attempt} failed:`, error.message);

            if (attempt === maxAttempts) {
                throw error;
            }

            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
    }
};

module.exports = connectDB;