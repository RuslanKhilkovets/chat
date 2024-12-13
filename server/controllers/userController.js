const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { default: mongoose } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const createToken = _id => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: '3d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, registerToken, email, password, phone, tag } = req.body;

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
      return res.status(400).json({ message: 'Password must be strong' });

    const tokenDoc = await tokenModel.findOne({ token: registerToken, isUsed: false });

    if (!tokenDoc)
      return res.status(400).json({ message: 'Invalid or already used registration token' });

    const playerId = uuidv4();

    user = new userModel({ name, email, password, registerToken, phone, tag, playerId });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    tokenDoc.isUsed = true;
    await tokenDoc.save();

    const token = createToken(user._id);

    logger.info(`User with email ${email} registered. Used token ${registerToken}`);

    res.status(200).json({ _id: user._id, name, email, registerToken, token, playerId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

const checkPassword = async (req, res) => {
  const { id, password } = req.body;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      return res.status(200).json({ message: 'Password is correct' });
    }

    return res.status(400).json({ message: 'Incorrect password' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
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
  const { userId } = req.params;

  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const user = await userModel.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err });
  }
};

const findUsersByNameOrTag = async (req, res) => {
  const { stringQuery } = req.query;

  try {
    if (!stringQuery)
      res.status(400).json({
        message: 'Bad request. Query can not be empty and must be defined!',
        users: [],
      });

    const users = await userModel.find({
      $or: [
        { name: { $regex: stringQuery, $options: 'i' } },
        { tag: { $regex: stringQuery, $options: 'i' } },
      ],
    });

    if (!users.length) return res.status(404).json({ message: 'User not found', users: [] });

    res.status(200).json({ users });
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

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, phone, tag, email } = req.body;

  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (tag !== undefined) user.tag = tag;
    if (email !== undefined) user.email = email;

    const updatedUser = await user.save();

    logger.info(`User with ID ${userId} updated successfully.`);

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUser,
  findUsersByNameOrTag,
  checkPassword,
  updateUser,
};
