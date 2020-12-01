const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'You must choose a UserName'],
    unique: true
  },
  count: {
    type: Number
  },
  email: {
    type: String,
    required: [true, 'Enter Your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email']
  },
  photo: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please choose a passord'],
    minlength: 8,
    maxlength: 40,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password dont match'
    },
    select: false
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.checkPassword = async function (
  providedPassword,
  userPassword
) {
  return await bcrypt.compare(providedPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
