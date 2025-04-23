const express = require("express");
const app = express();
const http = require("http");
const connectDB = require("./config.js/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const doctorRoute = require("./routes/doctorRoute");
const { Server } = require("socket.io");
require('dotenv').config(); // This should be at the very top
const PORT = process.env.PORT; 

const server = http.createServer(app);

app.use(express.json()); // Handles JSON data.
app.use(express.urlencoded({ extended: true })); //Use express.urlencoded() to parse data submitted via HTML forms.
app.use(cors());



const io = new Server(server, {
  cors: {
    origin: "*", // any frontend origin allowed
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_notification", ({ to, message }) => {
    console.log(`Doctor to ${to}: ${message}`);
    // Emit to specific patient using room or id
    io.to(to).emit("receive_notification", { message });
  });
  
  socket.on("join", (userId) => {
    socket.join(userId); // Join room using user ID
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(authRoutes);

app.use(userRoute);
app.use(doctorRoute);



// console.log("....directoryname....",__dirname);
//connect to mongodb
connectDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use((req, res, next) => {
  res.status(404).send('Sorry, the page you are looking for does not exist!');
});


server.listen(PORT);
