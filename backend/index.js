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

//connect to mongodb
connectDB();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(3000);
