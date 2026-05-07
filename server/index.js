const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

if (!global.crypto) {
    global.crypto = crypto;
}

const connectDB = require("./config/db");
const todoRoutes = require("./routes/todos");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/todos", todoRoutes);
app.use("/api/todo", todoRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});