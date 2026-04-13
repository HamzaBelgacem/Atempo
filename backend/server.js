const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Fake database (replace later with real DB)
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "test@demo.com",
    password: "1234",
    isRegistered: true,
  },
  {
    id: 2,
    name: "Anna Smith",
    email: "anna@test.com",
    password: "abcd",
    isRegistered: true,
  },
];

// 🔐 LOGIN ROUTE
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // ❌ Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // ✅ Never send password to frontend
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    isRegistered: user.isRegistered,
  };

  res.status(200).json({
    message: "Login successful",
    user: safeUser,
  });
});

// 📝 REGISTER ROUTE
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  // ❌ Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // ❌ Check if user already exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  // ✅ Create new user
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password, // ⚠️ Hash in real apps
    isRegistered: true,
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
  });
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// 🚀 Start server
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});