const jwt = require('jsonwebtoken');
const User = require('../models/user');

const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};
// const refreshToken = (id, count) => {
//   return jwt.sign({ id: id, count: count }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
//   });
// };

exports.signup = async (req, res) => {
  try {
    const { email } = await req.body;
    // const userExist = await User.findOne({ userName });
    const emailExist = await User.findOne({ email });

    if (emailExist) {
      return res.status(400).json({
        status: 'fail',
        message: 'This Email is already in use'
      });
    }
    // if (userExist) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'This UserName is already in use'
    //   });
    // }
    const newUser = await User.create({
      userName: req.body.userName,
      email: req.body.email,
      role: req.body.role,
      photo: req.body.photo,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      user: newUser
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

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message:
          'The email you entered isn’t connected to an account, please try again'
      });
    }
    if (!(await user.checkPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect password, please try again'
      });
    }
    const token = signToken(user._id);
    console.log(req.body);
    res.status(200).json({
      status: 'success',
      token,
      user: {
        _id: user._id,
        email: user.email,
        photo: user.photo,
        role: user.role,
        userName: user.userName
      }
    });
  } catch (err) {
    res.status(500).json({
      err
    });
  }
};

exports.validToken = async (req, res) => {
  console.log(req.body);
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.json(false);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    return res.json(true);
  } catch (err) {
    res.status(500).json({ err });
  }
};
