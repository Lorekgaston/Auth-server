const User = require('../models/user');
const { cloudinary } = require('../utils/cloudinary');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Cant get Users'
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      res.status(404).json({
        status: ' fail',
        message: 'No user found with that ID'
      });
    }
    res.status(200).json({
      status: 'succses',
      user
    });
  } catch (err) {
    res.status(500).json({
      status: 'internal erro',
      message: err.message
    });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const fileStr = req.body.photo;
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'dev_setup'
    });
    res.status(200).json({
      message: 'uploaded',
      imageUrl: uploadResponse.url
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log(req.body);
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.body.file) filteredBody.photo = req.body.file;

    // 3) updare user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );
    console.log(updatedUser);
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
