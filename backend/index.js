const express = require("express");
const app = express();
const connectDB = require("./config.js/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const doctorRoute = require("./routes/doctorRoute");

app.use(express.json()); // Handles JSON data.
app.use(express.urlencoded({ extended: true })); //Use express.urlencoded() to parse data submitted via HTML forms.
app.use(cors());

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


app.listen(3000);
