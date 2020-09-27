const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const { email, userName } = await req.body;
    const userExist = await User.findOne({ userName });
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'This Email is already in use'
      });
    }
    if (userExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'This UserName is already in use'
      });
    }
    const newUser = await User.create({
      userName: req.body.userName,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(500).json({
      err
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!email) {
      return res.status(400).json({
        status: 'fail',
        message: 'Enter your Email Adress'
      });
    }
    if (!password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Enter your Password'
      });
    }
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The email you’ve entered doesn’t match any account.'
      });
    }
    if (!(await user.checkPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect Pasword, Try again'
      });
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    res.status(500).json({
      err
    });
  }
};
