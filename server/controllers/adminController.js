const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const createToken = _id => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: '3d' });
};

const registerAdmin = async (req, res) => {
  try {
    const { login, password } = req.body;

    let admin = await adminModel.findOne({ login });

    if (admin) {
      return res.status(400).json({ message: 'Admin with given email already exists' });
    }

    if (!login || !password)
      return res.status(400).json({ message: 'All fields must be provided' });

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: 'Password must be a strong' });

    admin = new adminModel({ login, password });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    const token = createToken(admin._id);

    res.status(200).json({ _id: admin._id, login, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

const loginAdmin = async (req, res) => {
  const { login, password } = req.body;

  try {
    let admin = await adminModel.findOne({ login });

    if (!admin) return res.status(400).json({ message: 'Invalid login or password' });

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = createToken(admin._id);

    logger.info('Admin accessed dashboard', { _id: admin._id, login });

    res.status(200).json({ _id: admin._id, login: admin.login, token });
  } catch (err) {
    console.error(err);
  }
};

const findAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.adminId);

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

const getAdmin = async (_, res) => {
  try {
    const admins = await adminModel.find();

    console.log(admins);

    if (admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    res.status(200).json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = { registerAdmin, loginAdmin, findAdmin, getAdmin };
