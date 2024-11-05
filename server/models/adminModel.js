const moongoose = require('mongoose');

const adminSchema = new moongoose.Schema(
  {
    login: { type: String, required: true, minLength: 3, maxLength: 30 },
    password: { type: String, required: true, minLength: 8 },
  },
  {
    timestamps: true,
  },
);

const adminModel = moongoose.model('Admin', adminSchema);

module.exports = adminModel;
