const User = require('../models/user');

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
// exports.getUser = async () => {
//   try {
//     const user = await User.findById();

//     res.status(200).json({
//       status: 'succses',
//       user: {

//       }
//     });
//   } catch (err) {}
// };