import dotenv from 'dotenv';
dotenv.config(); // This should be at the very top
import express from 'express';
import http from 'http';
import connectDB from './config.js/db.js';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import doctorRoute from './routes/doctorRoute.js';
import { Server } from 'socket.io';
import { initSocket } from './utils/socket.js';

const app = express();
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

initSocket(io);

app.use(authRoutes);
app.use(userRoute);
app.use(doctorRoute);

//connect to mongodb
connectDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use((req, res, next) => {
  res.status(404).send('Sorry, the page you are looking for does not exist!');
});


server.listen(PORT);
