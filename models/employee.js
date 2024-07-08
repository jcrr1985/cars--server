const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	hireDate: Date,
	department: String,
	phone: String,
	address: String,
	isActive: Boolean,
	imageFilename: String,
	departmentHistory: [
		{
			department: String,
			date: Date
		}
	]
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
