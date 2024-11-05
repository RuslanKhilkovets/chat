const express = require('express');
const {
  registerAdmin,
  loginAdmin,
  findAdmin,
  getAdmin,
} = require('../controllers/adminController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/find/:adminId', findAdmin);
router.get('/', getAdmin);

module.exports = router;
