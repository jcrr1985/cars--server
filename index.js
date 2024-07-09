require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFsBucket } = require("mongodb");

// Rutas
const carRoutes = require("./routes/carRoutes.js");
const countriesRoute = require("./routes/countriesRoute.js");
const departmentRoutes = require("./routes/departmentRoutes.js");
const employeeRoutes = require("./routes/employeeRoutes.js");

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://jcrr1985:Tumama4$@cluster0.zi7aqsgn.mongodb.net/fullapp?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();
//cars-client-eta.vercel.app//
https: app.use(morgan("combined"));
const corsOptions = {
  origin: true,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

let gfs;
mongoose.connection.once("open", () => {
  gfs = new GridFsBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });
});

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: "uploads",
    };
  },
});

const upload = multer({ storage });

app.use("/cars", carRoutes(upload));
app.use("/", countriesRoute);
app.use("/", departmentRoutes);
app.use("/", employeeRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
