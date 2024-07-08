
const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
	department: String,
	date: Date
})

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;