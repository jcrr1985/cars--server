const express = require("express");
const Car = require("../models/car.js");
const multer = require("multer");

const { BlobServiceClient } = require("@azure/storage-blob");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
  process.env.BLOB_CONTAINER_NAME
);

const router = express.Router();

router.get("/cars", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.log("err::", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/cars/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      res.status(404).json({ message: "car not found" });
    }
    res.json(car);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/cars/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      hireDate,
      department,
      phone,
      address,
      isActive,
      forSell,
    } = req.body;
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        hireDate,
        department,
        phone,
        address,
        isActive,
        forSell,
      },
      { new: true }
    );

    console.log("updatedCar en server", updatedCar);

    if (!updatedCar) {
      res.status(404).json({ message: "car not found" });
    }
    res.json(updatedCar);
  } catch (error) {
    console.log("error.message", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.post("/cars", upload.single("image"), async (req, res) => {
  const { originalname } = req.file;

  const car = new Car({
    make: req.body.make,
    model: req.body.model,
    package: req.body.package,
    color: req.body.color,
    year: req.body.year,
    category: req.body.category,
    mileage: req.body.mileage,
    price: req.body.price,
    filename: originalname,
    forSell: req.body.forSell,
  });

  try {
    const blobName = `${car._id}/${originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // Sube el archivo al Blob Storage
    await blockBlobClient.uploadData(req.file.buffer);

    const createdCar = await car.save();
    res.status(201).json(createdCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/Cars/:id", async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);
    if (!deletedCar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(deletedCar);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error deleting car" });
  }
});

module.exports = router;
