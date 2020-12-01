const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({
        status: ' fail',
        message: 'You are Not logged in! please log in'
      });
    }
    const verified = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(403).json({
        message: 'invalid credentials'
      });
    }
    const currentUser = await User.findById(verified.id);
    if (!currentUser) {
      res.status(400).json({
        message: 'The user belonging to the token no longer exist'
      });
    }
    req.user = currentUser;
    console.log(req.user);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
  next();
};

module.exports = auth;
