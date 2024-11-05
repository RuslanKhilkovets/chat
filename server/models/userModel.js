const moongoose = require('mongoose');

const userSchema = new moongoose.Schema(
  {
    name: { type: String, required: true, minLength: 3, maxLength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minLength: 8 },
    registerToken: { type: String, required: false, unique: true },
  },
  {
    timestamps: true,
  },
);

const userModel = moongoose.model('User', userSchema);

module.exports = userModel;
