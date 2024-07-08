require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const carRoutes = require("./routes/carRoutes.js");
const countriesRoute = require("./routes/countriesRoute.js");
const departmentRoutes = require("./routes/departmentRoutes.js");
const employeeRoutes = require("./routes/employeeRoutes.js");

const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");

mongoose.connect(
  "mongodb+srv://jcrr1985:Tumama4$@cluster0.zi7qsgn.mongodb.net/fullapp",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/", carRoutes);
app.use("/", countriesRoute);
app.use("/", departmentRoutes);
app.use("/", employeeRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
