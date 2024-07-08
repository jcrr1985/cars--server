const express = require("express");
const Employee = require("../models/employee.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();

router.get("/employees", logger, async (req, res) => {
  console.log("req");
  try {
    const employees = await Employee.find();
    console.log("employees", employees);
    res.json(employees);
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: err.message });
  }
});

function logger(req, res, next) {
  console.log("fetching data from database");
  next();
}

router.get("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      res.status(404).json({ message: "Employee not found" });
    }
    console.log("employee", employee);
    res.json(employee);
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message });
  }
});

router.put("/employees/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      hireDate,
      department,
      phone,
      address,
      isActive,
    } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, hireDate, department, phone, address, isActive },
      { new: true }
    );

    if (!updatedEmployee) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      const departmentChange = {
        department: updatedEmployee.department,
        date: new Date(),
      };
      updatedEmployee.departmentHistory.push(departmentChange);
      await updatedEmployee.save();
      res.json(updatedEmployee);
    }
  } catch (error) {
    console.log("error.message", error.message);
    res.status(500).json({ message: error.message });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

router.post("/employees", upload.single("image"), async (req, res) => {
  const {
    firstName,
    lastName,
    hireDate,
    department,
    phone,
    address,
    isActive,
  } = req.body;

  const employee = new Employee({
    firstName,
    lastName,
    hireDate,
    department,
    phone,
    address,
    isActive,
    imageFilename: req.file.filename,
    departmentHistory: [{ department, date: new Date() }],
  });

  try {
    const createdEmployee = await employee.save();
    console.log("createdEmployee, en post -> employee, try", createdEmployee);
    res.status(201).json(createdEmployee);
  } catch (err) {
    console.log("createdEmployee, en post -> employee, catch", createdEmployee);

    res.status(400).json({ message: err.message });
  }
});

router.get("/employees/:id/department-history", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee.departmentHistory);
  } catch (error) {
    console.error("Error fetching department history:", error);
    res.status(500).json({ message: "Error fetching department history" });
  }
});

router.delete("/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    console.log("deletedEmployee", deletedEmployee);
    res.json(deletedEmployee);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

module.exports = router;
