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
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';




const app = express();
const PORT = process.env.PORT; 
const server = http.createServer(app);

// Simple CORS config (only allow your frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  methods:['GET', 'POST', 'PUT','DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-type', 'Authorization']
}));


// These two lines create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); // Handles JSON data.
app.use(express.urlencoded({ extended: true })); //Use express.urlencoded() to parse data submitted via HTML forms.
app.use(helmet());

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

if (process.env.NODE_ENV !== 'production') {
  console.log('Debug log');
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use((req, res, next) => {
  res.status(404).send('Sorry, the page you are looking for does not exist!');
});

// Then use __dirname as before
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(PORT);
