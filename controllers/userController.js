const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      users
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Cant get Users'
    });
  }
};
exports.getUser = async (req, res) => {
  console.log(req.params);
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        status: ' fail',
        message: 'No user found with that ID'
      });
    }
    console.log(user);
    res.status(200).json({
      status: 'succses',
      user
    });
  } catch (err) {
    res.status(500).json({
      status: 'internal error',
      message: err.message
    });
  }
};
