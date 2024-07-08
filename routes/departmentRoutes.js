const express = require('express');

const Department = require('../models/department.js');

const router = express.Router();

router.get('/departments', async (req, res) => {
	try {
		const departments = await Department.find();
		console.log('departments', departments)
		res.json(departments);
	}
	catch (err) {
		res.status(500).json({ message: err.message })
	}
});

module.exports = router;
