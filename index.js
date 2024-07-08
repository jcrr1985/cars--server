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

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(morgan("combined"));
const corsOptions = {
  origin: "https://cars-client-eta.vercel.app",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/", carRoutes);
app.use("/", countriesRoute);
app.use("/", departmentRoutes);
app.use("/", employeeRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
