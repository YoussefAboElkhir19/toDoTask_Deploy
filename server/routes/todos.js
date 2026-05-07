const express = require("express");

const Todo = require("../models/Todo");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Title is required" });
        }

        const todo = await Todo.create({ title: title.trim() });
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updates = {};

        if (typeof req.body.title === "string") {
            const title = req.body.title.trim();

            if (!title) {
                return res.status(400).json({ error: "Title is required" });
            }

            updates.title = title;
        }

        if (typeof req.body.completed === "boolean") {
            updates.completed = req.body.completed;
        }

        const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true
        });

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

        if (!todo) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json({ message: "Todo deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;