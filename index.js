import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Sample data
let users = [
  { id: 1, name: "Rahul" },
  { id: 2, name: "Amit" },
];

// GET all users
app.get("/users", (req, res) => {
  res.json(users);
});

// GET single user
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json(user);
});

// POST create user
app.post("/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };

  users.push(newUser);

  res.status(201).json(newUser);
});

// PUT update user
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.name = req.body.name;

  res.json(user);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id != req.params.id);

  res.json({
    message: "User deleted",
  });
});

// Start server
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
