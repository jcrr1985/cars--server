const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  make: String,
  model: String,
  package: String, // Este campo está mapeado desde 'pkg'
  color: String,
  year: String,
  category: String,
  mileage: String,
  price: String,
  filename: String,
  forSell: String,
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
