const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const createToken = _id => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: '3d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, registerToken, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User with given email already exists' });
    }

    if (!name || !email || !password || !registerToken)
      return res.status(400).json({ message: 'All fields must be provided' });

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    if (!validator.isStrongPassword(password))
      return res.status(400).json({ message: 'Password must be a strong' });

    const tokenDoc = await tokenModel.findOne({ token: registerToken, isUsed: false });

    if (!tokenDoc)
      return res.status(400).json({ message: 'Invalid or already used registration token' });

    user = new userModel({ name, email, password, registerToken });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    tokenDoc.isUsed = true;
    await tokenDoc.save();

    const token = createToken(user._id);

    logger.info(`User with email ${email} registered. Used token ${registerToken}`);

    res.status(200).json({ _id: user._id, name, email, registerToken, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = createToken(user._id);

    logger.info(`User with email ${email} has been logged.`);

    const responseModel = user.toObject();
    res.status(200).json({ ...responseModel, token });
  } catch (err) {
    console.error(err);
  }
};

const findUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await userModel.find();

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = { registerUser, loginUser, findUser, getUser };
