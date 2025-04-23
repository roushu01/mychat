const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/chat-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ User Model
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("hello", userSchema);

// ✅ Register Endpoint
app.post('/register', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ userId, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Login Endpoint
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", userId });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Socket.IO chat
io.on('connection', (socket) => {
  console.log('📡 New client connected');

  socket.on('sendMessage', (message) => {
    const timestamped = { ...message, timestamp: new Date() };
    io.emit('receiveMessage', timestamped);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
